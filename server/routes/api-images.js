import express from 'express';
import multer from 'multer';
import {fetchTags} from '../helpers/autoImageTagger.js';
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.post('/segment', upload.single('image'), async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.post('/tag', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No image file uploaded'});
    }
    try {
        const tags = await fetchTags(req.file);
        return res.json( tags );
    } catch (err) {
        console.error('Error fetching tags:', err);
        return res.status(500).json({error: 'Failed to fetch tags'});
    }
});
router.delete('/:id', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.put('/:id', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.get('/:id', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.post('/', upload.single('image'), async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.get('/', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});

export default router;