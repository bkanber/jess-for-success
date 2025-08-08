import Sequelize from 'sequelize';
// import model files as ESM modules
import Closet, { init as initCloset } from './Closet.js';
import Account, { init as initAccount } from './Account.js';
import File, { init as initFile } from './File.js';
import Token, { init as initToken } from './Token.js';
import Hanger, { init as initHanger } from './Hanger.js';

const env = process.env.NODE_ENV || 'development';
let modelsCache = null;

function loadModels() {
    if (modelsCache) {
        return modelsCache;
    }

    const sequelize = new Sequelize(
        null, null, null, {
            dialect: 'sqlite',
            storage: env === 'test' ? ':memory:' : './db.development.sqlite',
            logging: env !== 'production' ? console.log : false,
        });

    const db = {};
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    // Initialize models
    initCloset(sequelize);
    initAccount(sequelize);
    initFile(sequelize);
    initToken(sequelize);
    initHanger(sequelize);

    // Assign models to db object
    db.Account = Account;
    db.File = File;
    db.Token = Token;
    db.Hanger = Hanger;
    db.Closet = Closet;

    // Associate models
    Closet.belongsTo(File, { foreignKey: 'imageId', as: 'Image' });
    Closet.hasMany(Hanger, { foreignKey: 'closetId'});
    Closet.belongsTo(Account, { foreignKey: 'accountId'});
    Account.hasMany(Closet, { foreignKey: 'accountId' });
    Account.hasMany(File, { foreignKey: 'accountId' });
    Account.hasMany(Token, { foreignKey: 'accountId' });
    File.belongsTo(Account, { foreignKey: 'accountId' });
    Token.belongsTo(Account, { foreignKey: 'accountId' });
    Hanger.belongsTo(Closet, { foreignKey: 'closetId' });
    Hanger.belongsTo(File, { foreignKey: 'imageId', as: 'Image' });

    modelsCache = db;

    return db;
}

const db = loadModels();
export default db;
