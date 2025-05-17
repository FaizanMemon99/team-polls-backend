import express from 'express';
import {
  createPoll,
  castVote,
  getPoll,
  getAllPolls
} from '../controllers/poll.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// 🟢 Static routes first
router.get('/all', getAllPolls);

// 🟡 Dynamic route next
router.get('/:id', getPoll);

router.post('/', createPoll);
router.post('/:id/vote', authenticate, castVote);

export default router;
