import {Sequelize, DataTypes, Model} from 'sequelize';

export default class Hanger extends Model {

}

export function init(sequelize) {
    Hanger.init({
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
        closetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Closets',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        frontImageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Files', key: 'id' }
        },
        backImageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Files', key: 'id' }
        },
        aiNotes: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        }
    }, {
        sequelize,
        modelName: 'Hanger',
        tableName: 'Hangers',
        timestamps: true,
        paranoid: true
    });
}
