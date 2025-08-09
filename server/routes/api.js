import express from 'express';
import authRoutes from './api-auth.js';
import requireToken from '../helpers/requireApiTokenMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.get('/me', requireToken, async (req, res) => {
    return res.json({
        id: req.account.id,
        tokenExpiresAt: req.token.expiresAt,
    });
});

export default router;