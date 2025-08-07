import express from 'express';
import {pipeline} from '@huggingface/transformers';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 7777;
const upload = multer({storage: multer.memoryStorage()});

const classifier = await pipeline('text-classification', null, {
    progress_callback: (progress) => {
        if (progress.progress) {
            console.log(`Loading classifier (${progress.file}): ${progress.progress.toFixed(2)}%`);
        }
    }
});
const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', {
    progress_callback: (progress) => {
        if (progress.progress) {
            console.log(`Loading captioner (${progress.file}): ${progress.progress.toFixed(2)}%`);
        }
    }
});

app.post('/caption', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }

    console.log('Received file:', req.file.originalname);
    return res.send("OK");

    try {
        const captions = await captioner(req.file.buffer);
        res.json(captions);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({error: 'Failed to process image'});
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

