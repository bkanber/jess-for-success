import express from 'express';
import {pipeline} from '@huggingface/transformers';
import multer from 'multer';

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

app.options('/*splat', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
});

app.post('/caption', upload.single("file"), async (req, res) => {
    const file = req.file;
    const buffer = file ? file.buffer : null;

    console.log('Received file:', file ? file.originalname : 'No file');

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (buffer) {
        // reflect the file back in the response
        res.set('Content-Type', file.mimetype);
        res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);
        res.set('Content-Length', file.size);
        return res.send(buffer);
    } else {
        return res.status(400).json({error: 'No file uploaded'});
    }

});

app.get('/classify', async (req, res) => {
    const _out = await classifier(req.query.text || 'Hello, world!');
    res.json(_out);
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

