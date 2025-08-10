import express from 'express';
import authRoutes from './api-auth.js';
import chatRoutes from './api-chat.js';
import imageRoutes from './api-images.js';
import requireToken from '../helpers/requireApiTokenMiddleware.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', requireToken, chatRoutes);
router.use('/images', requireToken, imageRoutes);

router.get('/me', requireToken, async (req, res) => {
    return res.json({
        id: req.account.id,
        tokenExpiresAt: req.token.expiresAt,
    });
});

export default router;