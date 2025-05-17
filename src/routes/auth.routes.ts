import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/anon', (req, res) => {
  const userId = `user_${Date.now()}`;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
