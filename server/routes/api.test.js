import createTestApp from '../tests/createTestApp.js';
import apiRoutes from './api.js';
import request from 'supertest';

describe("API Routes", () => {
    let app;

    beforeAll(() => {
        app = createTestApp(apiRoutes);
    });

    test("/me should return 401 if no token is provided", async () => {
        const response = await request(app)
            .get('/me')
            .expect('Content-Type', /json/)
            .expect(401);

        expect(response.body).toHaveProperty('error', 'Token is required');
    });

    test("/me should return 401 for invalid token", async () => {
        const response = await request(app)
            .get('/me')
            .set('Authorization', 'Bearer invalidtoken')
            .expect('Content-Type', /json/)
            .expect(401);
        expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    test("/me should return account info for valid token", async () => {
        const acc = await app.locals.Models.Account.create({
            login: 'testuser3',
        });

        const token = await app.locals.Models.Token.create({
            accountId: acc.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        const response = await request(app)
            .get('/me')
            .set('Authorization', `Bearer ${token.token}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('id', acc.id);
        expect(new Date(response.body.tokenExpiresAt)).toEqual(token.expiresAt);

        // cleanup
        await app.locals.Models.Token.destroy({ where: { accountId: acc.id } });
        await app.locals.Models.Account.destroy({ where: { id: acc.id } });
    });

});