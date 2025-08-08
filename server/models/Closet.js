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
            allowNull: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Accounts', key: 'id' }
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
