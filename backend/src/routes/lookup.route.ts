import express from 'express';
import { fetchLookup } from '../controllers/lookup.controller';

const router = express.Router();

router.get('/:word', fetchLookup);

export default router;