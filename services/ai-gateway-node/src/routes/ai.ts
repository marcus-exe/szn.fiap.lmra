import { Router } from 'express';
import axios from 'axios';

const router = Router();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

interface ChatRequest {
  message: string;
  model?: string;
  stream?: boolean;
}

interface SummarizeRequest {
  text: string;
  model?: string;
}

// Chat endpoint with streaming support
router.post('/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { message, model = DEFAULT_MODEL, stream = false }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (stream) {
      // Streaming mode - Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let accumulatedContent = '';
      let totalTokens = 0;
      let firstChunkTime = 0;
      let previousTime = 0;
      let previousTokens = 0;

      try {
        const ollamaStream = await axios.post(`${OLLAMA_HOST}/api/chat`, {
          model,
          messages: [{ role: 'user', content: message }],
          stream: true
        }, {
          responseType: 'stream',
          timeout: 60000
        });

        ollamaStream.data.on('data', (chunk: Buffer) => {
          try {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                
                if (data.message?.content) {
                  accumulatedContent += data.message.content;
                  
                  if (firstChunkTime === 0) {
                    firstChunkTime = Date.now();
                    previousTime = firstChunkTime;
                  }
                  
                  // Estimate tokens and calculate speeds
                  const currentTime = Date.now();
                  const elapsed = (currentTime - firstChunkTime) / 1000;
                  const estimatedTokens = Math.ceil(accumulatedContent.split(/\s+/).length * 1.3);
                  
                  // Mean tokens per second (average over entire response)
                  const meanTokensPerSecond = elapsed > 0 ? (estimatedTokens / elapsed).toFixed(2) : '0';
                  
                  // Current/instantaneous tokens per second (speed in the last chunk)
                  const chunkDuration = (currentTime - previousTime) / 1000;
                  const tokensInChunk = estimatedTokens - previousTokens;
                  const currentTokensPerSecond = chunkDuration > 0 && tokensInChunk > 0 ? (tokensInChunk / chunkDuration).toFixed(2) : '0';
                  
                  previousTime = currentTime;
                  previousTokens = estimatedTokens;
                  
                  // Send chunk to client with real-time metrics
                  res.write(`data: ${JSON.stringify({
                    chunk: data.message.content,
                    metrics: {
                      tokens: estimatedTokens,
                      duration: elapsed.toFixed(2),
                      meanTokensPerSecond: parseFloat(meanTokensPerSecond),
                      currentTokensPerSecond: parseFloat(currentTokensPerSecond)
                    }
                  })}\n\n`);
                }
                
                if (data.done) {
                  totalTokens = data.eval_count || Math.ceil(accumulatedContent.split(/\s+/).length * 1.3);
                  const duration = (Date.now() - startTime) / 1000;
                  const meanTokensPerSecond = totalTokens > 0 ? (totalTokens / duration).toFixed(2) : '0';
                  
                  res.write(`data: ${JSON.stringify({
                    done: true,
                    metrics: {
                      tokens: totalTokens,
                      duration: duration.toFixed(2),
                      meanTokensPerSecond: parseFloat(meanTokensPerSecond)
                    }
                  })}\n\n`);
                  res.end();
                }
              } catch (parseError) {
                console.error('Error parsing JSON line:', parseError);
              }
            }
          } catch (error) {
            console.error('Error processing stream chunk:', error);
          }
        });

        ollamaStream.data.on('end', () => {
          res.end();
        });

        ollamaStream.data.on('error', (error: Error) => {
          console.error('Stream error:', error);
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        });
      } catch (streamError: any) {
        console.error('Error setting up stream:', streamError);
        res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
        res.end();
      }
    } else {
      // Non-streaming mode
      const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
        model,
        messages: [{ role: 'user', content: message }],
        stream: false
      }, {
        timeout: 60000
      });

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const totalTokens = response.data.eval_count || 0;
      const tokensPerSecond = totalTokens > 0 ? (totalTokens / duration).toFixed(2) : '0';

      res.json({
        response: response.data.message.content,
        model: response.data.model,
        metrics: {
          tokens: totalTokens,
          duration: duration.toFixed(2),
          tokensPerSecond: parseFloat(tokensPerSecond)
        }
      });
    }
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
