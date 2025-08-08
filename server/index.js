import express from 'express';
import Models from './models/index.js';
import routes from './routes/index.js';
import {loadPipelineModels} from './helpers/pipelines.js';

const app = express();
const PORT = process.env.PORT || 7777;

async function startServer() {
    try {
        // Sync database models
        await Models.sequelize.sync({alter: true});
        console.log('Database models synced successfully');
    } catch (err) {
        console.error('Error syncing database models:', err);
        process.exit(1); // Exit if models cannot be synced
    }

    try {
        // Load all pipeline models
        await loadPipelineModels();
        console.log('All pipeline models loaded successfully');
    } catch (err) {
        console.error('Error loading pipeline models:', err);
        process.exit(2); // Exit if models cannot be loaded
    }

    app.locals.Models = Models;
    app.use(routes);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer()
    .catch(err => {
        console.error('Error starting server:', err);
        process.exit(3); // Exit if server cannot start
    });