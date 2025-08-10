import express from 'express';
import multer from 'multer';
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.post('/segment', upload.single('image'), async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
});
router.post('/tag', upload.single('image'), async (req, res) => {
    return res.status(501).json({error: 'Not implemented'});
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