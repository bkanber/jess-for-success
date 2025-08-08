import express from 'express';
import {pipeline} from '@huggingface/transformers';
import multer from 'multer';
import sharp from 'sharp';
import Models from './models/index.js';

const app = express();
const PORT = process.env.PORT || 7777;
const upload = multer({storage: multer.memoryStorage()});

// const classifier = await pipeline('text-classification', null, {
//     progress_callback: (progress) => {
//         if (progress.progress) {
//             console.log(`Loading classifier (${progress.file}): ${progress.progress.toFixed(2)}%`);
//         }
//     }
// });
// const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', {
//     progress_callback: (progress) => {
//         if (progress.progress) {
//             console.log(`Loading captioner (${progress.file}): ${progress.progress.toFixed(2)}%`);
//         }
//     }
// });
//

const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content for preflight requests
    }
    next();
}

app.options('/*splat', allowCors);

app.post('/caption', allowCors, upload.single("file"), async (req, res) => {
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

        // reflect the file back in the response
        res.set('Content-Type', file.mimetype);
        res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);
        res.set('Content-Length', smallBuffer.size);
        return res.send(smallBuffer);

});

app.get('/classify', async (req, res) => {
    const _out = await classifier(req.query.text || 'Hello, world!');
    res.json(_out);
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Initialize database models before starting the server

Models.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });


