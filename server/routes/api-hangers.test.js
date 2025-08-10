import createTestApp from '../tests/createTestApp.js';
import apiRoutes from './api-hangers.js';
import request from 'supertest';

describe("API Routes", () => {
    let app;

    beforeAll(async () => {
        app = createTestApp(apiRoutes);
    });

    test("getting a nonexistent hanger returns 404", async () => {
        const response = await request(app)
            .get('/api/hangers/999999')
            .set('Content-Type', 'application/json')
            .expect(404);
    });


});