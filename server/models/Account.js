import {Sequelize, DataTypes, Model} from 'sequelize';
import * as argon2 from 'argon2';

export default class Account extends Model {
    // Method to verify password
    async verifyPassword(password) {
        if (!this.password) return false;
        return await argon2.verify(this.password, password);
    }

    async setPassword(password) {
        if (password) {
            const hashedPassword = await argon2.hash(password);
            this.setDataValue('password', hashedPassword);
        } else {
            this.setDataValue('password', null);
        }
    }

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
            set(value) {
                throw new Error("Use setPassword method to set password");
            }
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
