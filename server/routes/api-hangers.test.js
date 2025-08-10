import createTestApp from '../tests/createTestApp.js';
import apiRoutes from './api-hangers.js';
import request from 'supertest';

describe("API Routes", () => {
    let app;

    beforeAll(async () => {
        app = createTestApp(apiRoutes);
    });

    test("DELETE /:id should return 501 Not Implemented", async () => {
        const response = await request(app)
            .delete('/123')
            .expect(501);
        expect(response.body).toEqual({ error: 'Not implemented' });
    });


});