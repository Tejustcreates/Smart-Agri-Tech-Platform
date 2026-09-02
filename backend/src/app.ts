import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/validate';

// Route imports
import authRoutes from './routes/auth';
import weatherRoutes from './routes/weather';
import cropRoutes from './routes/crops';
import diseaseRoutes from './routes/disease';
import mandiRoutes from './routes/mandi';
import equipmentRoutes from './routes/equipment';
import schemeRoutes from './routes/schemes';
import newsRoutes from './routes/news';
import dashboardRoutes from './routes/dashboard';
import adminRoutes from './routes/admin';

const app = express();

// ─── Security Middleware ────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later', code: 'AUTH_RATE_LIMITED' },
});
app.use('/api/auth', authLimiter);

// ─── Body Parsing ───────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ───────────────────────────────────────────

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Serve frontend static files in production
if (env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../dist')));
}

// ─── API Routes ─────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ───────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ─── Catch-all for SPA in production ────────────────────────

if (env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
  });
}

// ─── Error Handler ──────────────────────────────────────────

app.use(errorHandler);

export default app;
