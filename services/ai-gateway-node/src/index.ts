import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { aiRoutes } from './routes/ai';
import { modernizationRoutes } from './routes/modernization';
import { healthRoutes } from './routes/health';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/modernization', modernizationRoutes);
app.use('/', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`AI Gateway service running on port ${PORT}`);
});

