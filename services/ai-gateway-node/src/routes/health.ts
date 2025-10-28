import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'ai-gateway',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRoutes };

