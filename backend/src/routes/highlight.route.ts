import express from 'express';
import { getAllHighlights, getHighlightById, createHighlight, updateHighlight, deleteHighlight } from '../controllers/highlight.controller';

const router = express.Router();

router.get('/', getAllHighlights);
router.get('/:id', getHighlightById);
router.post('/createHighlight', createHighlight);
router.put('/updateHighlight/:id', updateHighlight);
router.delete('/deleteHighlight/:id', deleteHighlight);

export default router;