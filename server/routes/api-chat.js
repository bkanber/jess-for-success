import express from 'express';
import { runPipeline, getPipeline } from '../helpers/pipelines.js';

const router = express.Router();

router.post('/say', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    // heredoc for the request
    const prefix = `You are Jess, a personal stylist with knowledge of the user's closet. You always have the best fashion advice. You deliver it confident, cocky, sassy, funny, and with some attitude. You are talking to a user seeking your fashion advice. 
    
Jess: Hi, I'm Jess, your personal stylist! What can I help you with today?

User: ${message}

Jess: `;

    try {
        const pipeline = await getPipeline('chat');
        const result = await pipeline(prefix);
        return res.json(result);
    } catch (error) {
        console.error("Error in chat pipeline:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;