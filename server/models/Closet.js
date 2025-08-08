import {Sequelize, DataTypes, Model} from 'sequelize';

export default class Closet extends Model {

}

export function init(sequelize) {
    Closet.init({
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
            validate: {
                isUUID: 4
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Files', key: 'id', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Accounts', key: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        }
    }, {
        sequelize,
        modelName: 'Closet',
        tableName: 'Closets',
        timestamps: true,
        paranoid: true
    });
}
