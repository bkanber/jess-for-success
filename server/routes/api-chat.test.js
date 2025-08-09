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

    test("POST /say should return chat response", async () => {
        await getPipeline('chat'); // Ensure the chat pipeline is initialized
        const response = await request(app)
            .post('/say')
            .send({ message: "What colors should I avoid with a brown belt?" })
            .set('Content-Type', 'application/json')
            .expect(200);

        console.log(response.body);
        expect(response.body).toHaveProperty('response');
        expect(typeof response.body.response).toBe('string');
        expect(response.body.response.length).toBeGreaterThan(0);
    }, 30000);
});