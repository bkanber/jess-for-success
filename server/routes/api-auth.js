import express from 'express';

const router = express.Router();

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