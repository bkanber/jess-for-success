import {Sequelize, DataTypes, Model} from 'sequelize';

export default class Account extends Model {

}

export function init(sequelize) {
    Account.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'Files', key: 'id' }
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        }
    }, {
        sequelize,
        modelName: 'Account',
        tableName: 'Accounts',
        timestamps: true,
        paranoid: true
    });
}
