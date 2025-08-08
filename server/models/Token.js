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
    }, {
        sequelize,
        modelName: 'Token',
        tableName: 'Tokens',
        timestamps: true,
        paranoid: true
    });
}
