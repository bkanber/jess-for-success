import express from 'express';
import Models from '../models/index.js';
import sharp from "sharp";
import multer from 'multer';
import {getPipeline} from '../helpers/pipelines.js';

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
    const maxDim = 512;
    if (metadata.width > maxDim || metadata.height > maxDim) {
        img = img.resize(maxDim, maxDim, {fit: 'cover'});
        const {width, height} = await img.metadata();
        console.log(`Resized image to: ${width}x${height}`);
    }

    const smallBuffer = await img.png().toBuffer();
    // turn buffer into a blob
    console.log('Processed image buffer size:', smallBuffer.length);
    const blob = new Blob([smallBuffer], {type: file.mimetype});

    // reflect the file back in the response
    // res.set('Content-Type', file.mimetype);
    // res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);
    // res.set('Content-Length', smallBuffer.size);
    // return res.send(smallBuffer);

    const captioner = await getPipeline('image-to-text');
    const classifier = await getPipeline('image-classification');
    const zeroShotClassifier = await getPipeline('zero-shot-image-classification');

    const caption = await captioner(blob);
    console.log('Caption generated:', caption);
    const classification = await classifier(blob);
    console.log('Classification result:', classification);
    const zeroShotClassification = await zeroShotClassifier(blob, ['cat', 'dog', 'car', 'tree', 'house', 'person', 'bicycle', 'flower', 'computer', 'phone'], {multi_label: true});
    console.log('Zero-shot classification result:', zeroShotClassification);
    return res.json({
        caption: caption[0]?.generated_text || 'No caption generated',
        classification: classification || [],
        zeroShotClassification: zeroShotClassification || []
    });
});

router.get('/', (req, res) => {
    res.send('Hello, world!');
});

export default router;