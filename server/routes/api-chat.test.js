import createTestApp from '../tests/createTestApp.js';
import apiChatRoutes from './api-chat.js';
import request from 'supertest';
import {getPipeline} from '../helpers/pipelines.js';

describe("API Chat Routes", () => {
    let app;

    beforeAll(async () => {
        app = createTestApp(apiChatRoutes);
    });

    test("POST /say should return 400 if message is missing", async () => {
        const response = await request(app)
            .post('/say')
            .send({ history: [] })
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(response.body).toEqual({ error: 'Message is required' });
    });

});