import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'] || ''
});

app.use(cors({
  origin: ['http://localhost:8100', 'https://dragonball-app-ia.web.app']
}));
app.use(express.json());

interface StoryRequest {
  prompt: string;
  max_tokens: number;
}

app.post('/api/generate-story', async (req: Request<{}, {}, StoryRequest>, res: Response) => {
  try {
    const { prompt, max_tokens } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: max_tokens,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    res.json({ story: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating story' });
  }
});

const port = parseInt(process.env['PORT'] || '3000');
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
