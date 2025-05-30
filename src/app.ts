import express from 'express';
import cors from 'cors';
import { identifySchema } from './types';
import { identifyContact } from './db';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/identify', async (req, res) => {
  try {
    const data = identifySchema.parse(req.body);
    const result = await identifyContact(data);
    res.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Error in /identify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;