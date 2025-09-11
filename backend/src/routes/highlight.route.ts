import express from 'express';
import { getAllHighlights, getHighlightById, createHighlight, updateHighlightById, deleteHighlightById } from '../controllers/highlight.controller';

const router = express.Router();

router.get('/', getAllHighlights);
router.get('/:id', getHighlightById);
router.post('/createHighlight', createHighlight);
router.put('/updateHighlight/:id', updateHighlightById);
router.delete('/deleteHighlight/:id', deleteHighlightById);

export default router;