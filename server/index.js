import express from 'express';
import {pipeline} from '@huggingface/transformers';

const app = express();
const PORT = process.env.PORT || 7777;

const classifier = await pipeline('text-classification', null, {
    progress_callback: (progress) => {
        if (progress.progress) {
            console.log(`Loading classifier (${progress.file}): ${progress.progress.toFixed(2)}%`);
        }
    }
});
const captioner = await pipeline('image-to-text', 'Salesforce/blip-image-captioning-base', {
    progress_callback: (progress) => {
        if (progress.progress) {
            console.log(`Loading captioner (${progress.file}): ${progress.progress.toFixed(2)}%`);
        }
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

