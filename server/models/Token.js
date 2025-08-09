import {Sequelize, DataTypes, Model} from 'sequelize';

export default class Token extends Model {

}

export function init(sequelize) {
    Token.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'access',
            validate: {
                isIn: [['access', 'refresh', 'verification', 'password_reset']]
            }
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: sequelize.getDialect() !== 'sqlite',
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Accounts',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Token',
        tableName: 'Tokens',
        timestamps: true,
        paranoid: true
    });
}
