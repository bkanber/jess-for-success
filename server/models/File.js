import {Sequelize, DataTypes, Model} from 'sequelize';
import sharp from 'sharp';
import mime from 'mime-types';

export default class File extends Model {
    static async upload(data, { accountId, quality = 80, maxDimension = 1024 }) {
        if (!data) throw new Error('No data provided');
        let buffer;
        if (Buffer.isBuffer(data)) {
            buffer = data;
        } else if (typeof data === 'string') {
            buffer = Buffer.from(data, data.startsWith('data:') ? 'base64' : 'utf8');
        } else {
            throw new Error('Data must be a Buffer or base64 string');
        }

        // Preprocess image with sharp
        let image = sharp(buffer);
        const metadata = await image.metadata();
        if (!['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
            throw new Error('Unsupported image format');
        }
        // Resize if needed
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
            image = image.resize({
                width: maxDimension,
                height: maxDimension,
                fit: 'inside',
            });
        }
        // Set quality for jpeg/webp
        if (metadata.format === 'jpeg') image = image.jpeg({ quality });
        if (metadata.format === 'webp') image = image.webp({ quality });
        const processedBuffer = await image.toBuffer();
        const mimetype = mime.lookup(metadata.format) || 'application/octet-stream';
        const extension = mime.extension(mimetype);
        const basename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        return await File.create({
            accountId,
            name: basename,
            size: processedBuffer.length,
            type: mimetype,
            host: 'local',
            basename,
            extension,
            data: processedBuffer,
            metadata,
        });
    }
}

export function init(sequelize) {
    File.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: sequelize.getDialect() !== 'sqlite',
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Accounts',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        name: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        type: {
            type: DataTypes.STRING,
        },
        host: {
            type: DataTypes.STRING,
            defaultValue: 'local'
        },
        basename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        extension: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // alias for data
        buffer: {
            type: DataTypes.VIRTUAL,
            get() { return this.getDataValue('data'); },
            set(value) { this.setDataValue('data', value); }
        },
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            get() {
                const data = this.getDataValue('data');
                if (data) {
                    return Buffer.from(data);
                }
                return null;
            },
            set(value) {
                if (value instanceof Buffer) {
                    this.setDataValue('data', value);
                } else if (typeof value === 'string') {
                    this.setDataValue('data', Buffer.from(value, 'utf8'));
                } else {
                    throw new Error('Data must be a Buffer or a string');
                }
            }
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        }
    }, {
        sequelize,
        modelName: 'File',
        tableName: 'Files',
        timestamps: true,
        paranoid: true
    });
}
