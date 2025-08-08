import {Sequelize, DataTypes, Model} from 'sequelize';

export default class File extends Model {

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
