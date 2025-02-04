import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

export default app;
