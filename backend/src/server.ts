import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import rootRouter from './routes';

const app = express();

// Güvenlik Middleware'leri
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// DDOS ve Bruteforce Koruması (Dakikada max 100 istek)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// API Rotaları
app.use('/api', rootRouter);

// Global Hata Yakalayıcı (En sonda olmalı)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Sunucu ${env.PORT} portunda güvenli şekilde başlatıldı (${env.NODE_ENV})`);
});
