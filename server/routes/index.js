import express from 'express';
import Models from '../models/index.js';
import sharp from "sharp";
import multer from 'multer';
import {getPipeline, runTask} from '../helpers/pipelines.js';
import apiRouter from './api.js';
import {fetchTags} from '../helpers/autoImageTagger.js';

const upload = multer({storage: multer.memoryStorage()});
const router = express.Router();

const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content for preflight requests
    }
    next();
}

router.options('/*splat', allowCors);

router.use('/api', allowCors, apiRouter);

router.post('/tagimage', allowCors, upload.single("file"), async (req, res) => {
    const file = req.file;
    const buffer = file ? file.buffer : null;

    if (!buffer) {
        return res.status(400).json({error: 'No file uploaded'});
    }

    console.log('Received file:', file ? file.originalname : 'No file');
    console.log("Buffer size:", buffer.length);
    const tags = await fetchTags(file);
    console.log('Generated tags:', tags);
    return res.json(tags);
});
router.post('/caption', allowCors, upload.single("file"), async (req, res) => {
    const file = req.file;
    const buffer = file ? file.buffer : null;
    if (!buffer) {
        return res.status(400).json({error: 'No file uploaded'});
    }

    console.log('Received file:', file ? file.originalname : 'No file');

    let img = sharp(buffer);
    const metadata = await img.metadata();

    if (!metadata || !metadata.width || !metadata.height) {
        return res.status(400).json({error: 'Invalid image file'});
    }

    console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);
    const maxDim = 1024;
    if (metadata.width > maxDim || metadata.height > maxDim) {
        img = img.resize(maxDim, maxDim, {fit: 'contain'});
        const {width, height} = await img.metadata();
        console.log(`Resized image to: ${width}x${height}`);
    }

    const smallBuffer = await img.png().toBuffer();
    // turn buffer into a blob
    console.log('Processed image buffer size:', smallBuffer.length);
    const blob = new Blob([smallBuffer], {type: file.mimetype});
    const result = await runTask('image', blob);
    console.log('Task result:', result);
    return res.json(result);

});

router.get('/', (req, res) => {
    res.send('Hello, world!');
});

export default router;