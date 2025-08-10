import createTestApp from '../tests/createTestApp.js';
import apiAuthRoutes from './api-auth.js';
import request from 'supertest';

describe("API Auth token", () => {
    let app;

    beforeAll(() => {
        app = createTestApp(apiAuthRoutes);
    });

    test("it should create a token for an account", async () => {
        const acc = await app.locals.Models.Account.create({
            login: 'testuser',
        });
        await acc.setPassword('testpassword');
        await acc.save();

        const response = await request(app)
            .post('/token')
            .send({
                login: 'testuser',
                password: 'testpassword'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        // cleanup
        await app.locals.Models.Token.destroy({ where: { accountId: acc.id } });
        await app.locals.Models.Account.destroy({ where: { id: acc.id } });

    });

    test("it should return 400 for missing login or password", async () => {
        await request(app)
            .post('/token')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400);
    });

    test("it should return 401 for invalid login or password - nonexistent user", async () => {
        const response = await request(app)
            .post('/token')
            .send({
                login: 'nonexistentuser',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid login or password');
    });

    test("it should return 401 for invalid login or password - invalid password", async () => {
        const acc = await app.locals.Models.Account.create({
            login: 'testuser2',
        });
        await acc.setPassword('correctpassword');
        await acc.save();

        const response = await request(app)
            .post('/token')
            .send({
                login: 'nonexistentuser',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid login or password');

        // cleanup
        await app.locals.Models.Token.destroy({ where: { accountId: acc.id } });
        await app.locals.Models.Account.destroy({ where: { id: acc.id } });
    });

});

describe("API Auth register", () => {
    let app;

    beforeAll(() => {
        app = createTestApp(apiAuthRoutes);
    });

    test("it should register a new account", async () => {
        const response = await request(app)
            .post('/register')
            .send({
                email: 'TEST@test.com',
                password: 'testpassword'
            })
            .expect('Content-Type', /json/)
            .expect(201);
        expect(response.body).toHaveProperty('login');
        expect(response.body).toHaveProperty('uuid');
        expect(response.body).toHaveProperty('email', 'test@test.com');
        expect(response.body.login).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hash format
        expect(response.body.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/); // UUID format
        // Cleanup
        const account = await app.locals.Models.Account.findOne({
            where: {email: 'test@test.com'}
        });
        if (account) {
            await app.locals.Models.Token.destroy({where: {accountId: account.id}});
            await app.locals.Models.Account.destroy({where: {id: account.id}});
        }
    });
});