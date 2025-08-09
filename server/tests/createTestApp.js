import express from 'express';
import Models from '../models/index.js';

export default function createTestApp(router, options = {}) {
    const app = express();
    app.locals.Models = Models; // Attach models to app locals for testing
    app.use(express.json());
    app.use(router);
    return app;
}