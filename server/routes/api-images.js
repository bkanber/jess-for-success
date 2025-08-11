import express from 'express';
import multer from 'multer';
import {fetchTags} from '../helpers/autoImageTagger.js';
import sharp from 'sharp';
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
router.get('/:id', async (req, res) => {
    const file = await req.app.locals.Models.File.findOne({
        where: {
            id: req.params.id,
            accountId: req.account.id
        },
        attributes: {exclude: ['data']}
    });
    if (!file) {
        return res.status(404).json({error: 'File not found'});
    }
    return res.json(file);
});
router.get('/:id/data', async (req, res) => {
    const file = await req.app.locals.Models.File.findOne({
        where: {
            id: req.params.id,
            accountId: req.account.id
        }
    });
    if (!file) {
        return res.status(404).json({error: 'File not found'});
    }
    const width = req.query.width ? parseInt(req.query.width) : 20;
    let imgData = file.data;
    if (!imgData) {
        return res.status(404).json({error: 'Image data not found'});
    }

    let img = sharp(imgData);
    try {
        img = img.resize({width: width, fit: 'inside'});
        const newImgData = await img.toBuffer();
        imgData = newImgData;
    } catch (e) {
        console.error("Error resizing image", e.message);
    }

    res.set('Content-Type', file.mimetype);
    return res.send(imgData);
});

router.put('/:id', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.post('/', upload.single('image'), async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.get('/', async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});

export default router;