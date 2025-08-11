import express from 'express';
import multer from 'multer';
import Models from '../models/index.js';

const upload = multer({storage: multer.memoryStorage()});
const { Hanger, File, Closet } = Models;

const router = express.Router();

router.delete('/:id', async (req, res) => {
    try {
        const hanger = await Hanger.findOne({ where: { id: req.params.id, accountId: req.account.id}});
        if (!hanger) return res.status(404).json({ error: 'Not found' });
        await hanger.destroy();
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const hanger = await Hanger.findOne({ where: { id: req.params.id, accountId: req.account.id } });
        if (!hanger) return res.status(404).json({ error: 'Not found' });
        await hanger.update(req.body);
        return res.json(hanger);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const hanger = await Hanger.findOne({ where: { id: req.params.id, accountId: req.account.id }});
        if (!hanger) return res.status(404).json({ error: 'Not found' });
        return res.json(hanger);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, caption, vibe, type, color, pattern, closetId } = req.body;
        let frontImageId = null;
        if (req.file) {
            const file = await File.upload(req.file.buffer, { accountId: req.account.id });
            frontImageId = file.id;
        }
        const hanger = await Hanger.create({
            accountId: req.account.id,
            name,
            description: caption,
            frontImageId,
            aiNotes: { name, caption, vibe, type, color, pattern },
            closetId: closetId || null
        });
        return res.status(201).json(hanger);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const where = {};
        if (req.query.closetId) {
            // Only allow closets belonging to this account
            const closet = await Closet.findOne({ where: { id: req.query.closetId, accountId: req.account.id } });
            if (!closet) return res.status(403).json({ error: 'Forbidden' });
            where.closetId = req.query.closetId;
        } else {
            // Only hangers in closets belonging to this account
            where.closetId = db.Sequelize.literal(`closetId IN (SELECT id FROM Closets WHERE accountId = ${req.account.id})`);
        }
        const hangers = await Hanger.findAll({ where });
        return res.json(hangers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;