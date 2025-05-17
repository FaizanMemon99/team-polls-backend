import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import pollRoutes from './routes/poll.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Add this root route to confirm server is up
app.get('/', (req, res) => {
  res.send('API is running ✅');
});

// Important: Use correct prefixes
app.use('/poll', pollRoutes);
app.use('/auth', authRoutes);

export default app;
