import { Router } from 'express';
import axios from 'axios';

const router = Router();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

interface ChatRequest {
  message: string;
  model?: string;
}

interface SummarizeRequest {
  text: string;
  model?: string;
}

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, model = DEFAULT_MODEL }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model,
      messages: [{ role: 'user', content: message }],
      stream: false
    }, {
      timeout: 60000 // 60 second timeout
    });

    res.json({
      response: response.data.message.content,
      model: response.data.model
    });
  } catch (error) {
    console.error('Error calling Ollama:', error);
    if (axios.isAxiosError(error)) {
      return res.status(500).json({ 
        error: 'Failed to communicate with AI service',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Summarize endpoint
router.post('/summarize', async (req, res) => {
  try {
    const { text, model = DEFAULT_MODEL }: SummarizeRequest = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Summarize the following text in a concise manner:\n\n${text}`;

    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model,
      prompt,
      stream: false
    }, {
      timeout: 60000
    });

    res.json({
      summary: response.data.response,
      model: response.data.model
    });
  } catch (error) {
    console.error('Error summarizing text:', error);
    if (axios.isAxiosError(error)) {
      return res.status(500).json({ 
        error: 'Failed to summarize text',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available models
router.get('/models', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_HOST}/api/tags`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch available models' });
  }
});

export { router as aiRoutes };

