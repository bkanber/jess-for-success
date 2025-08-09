/**
 * Setup environment for jest tests
 */
import Models from '../models/index.js';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
    // Ensure database is synced for tests
    await Models.sequelize.sync({ force: true });
});

afterAll(async () => {
    // Clean up database connections
    await Models.sequelize.close();
});
