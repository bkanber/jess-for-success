import express from 'express';
import {createHash} from 'crypto';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {email, password} = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const login = 'email:' + cleanEmail;
    const loginHash = createHash('sha256').update(login).digest('hex');
    const existingAccount = await req.app.locals.Models.Account.findOne({
        where: {login: loginHash}
    });
    if (existingAccount) {
        return res.status(400).json({error: 'Account already exists'});
    }
    const account = await req.app.locals.Models.Account.create({
        login: loginHash,
        email: cleanEmail,
    });
    await account.setPassword(password);
    await account.save();
    return res.status(201).json({
        login: account.login,
        uuid: account.uuid,
        email: account.email
    });
});

router.post('/token', async (req, res) => {
    const {login, password} = req.body;
    if (!login || !password) {
        return res.status(400).json({error: 'Login and password are required'});
    }

    const account = await req.app.locals.Models.Account.findOne({
        where: {login} // Note: Password should be hashed in production
    });

    if (!account) {
        return res.status(401).json({error: 'Invalid login or password'});
    }

    const isPasswordValid = await account.verifyPassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({error: 'Invalid login or password'});
    }

    const token = await req.app.locals.Models.Token.create({
        accountId: account.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    return res.json({
        token: token.token,
        expiresAt: token.expiresAt
    });

});

export default router;