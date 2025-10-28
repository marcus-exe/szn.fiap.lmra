import { Router } from 'express';
import axios from 'axios';

const router = Router();
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

interface ModernizeCodeRequest {
  code: string;
  language: string;
  targetVersion?: string;
}

// Modernize code endpoint
router.post('/modernize', async (req, res) => {
  try {
    const { code, language, targetVersion }: ModernizeCodeRequest = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const prompt = `You are an expert code modernization assistant. Please provide recommendations to modernize the following ${language} code.

Target: ${targetVersion || 'modern version'}
Current code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. A brief explanation of deprecated patterns in the code
2. Modern replacement recommendations
3. Example of modernized code

Be concise and practical.`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 120000 // 2 minute timeout for complex analysis
    });

    res.json({
      recommendations: response.data.message.content,
      model: response.data.model
    });
  } catch (error) {
    console.error('Error analyzing code:', error);
    if (axios.isAxiosError(error)) {
      return res.status(500).json({ 
        error: 'Failed to analyze code',
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Compare patterns endpoint
router.post('/compare-patterns', async (req, res) => {
  try {
    const { oldPattern, newPattern, language } = req.body;

    if (!oldPattern || !newPattern || !language) {
      return res.status(400).json({ error: 'Old pattern, new pattern, and language are required' });
    }

    const prompt = `Compare these two code patterns in ${language} and explain the benefits of the modern approach:

OLD PATTERN:
\`\`\`${language}
${oldPattern}
\`\`\`

NEW PATTERN:
\`\`\`${language}
${newPattern}
\`\`\`

Provide a comparison highlighting:
1. What makes the old pattern outdated
2. Benefits of the new pattern
3. Potential issues the old pattern might have`;

    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    }, {
      timeout: 60000
    });

    res.json({
      comparison: response.data.message.content,
      model: response.data.model
    });
  } catch (error) {
    console.error('Error comparing patterns:', error);
    res.status(500).json({ error: 'Failed to compare patterns' });
  }
});

export { router as modernizationRoutes };

