import express from 'express';
import config from './config/config';
import router from './routes';
import cors from 'cors';
import prisma from './client/prisma.client';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use('/api/auth', router);

// Connect prisma
prisma.$connect();

// Start the server
const PORT = config.api.port;
const HOST = config.api.host;
const server = app.listen(PORT, HOST, () => {
    console.info(
        `🪪  Authentication service started at: http://${HOST}:${PORT}`
    );
});

// Graceful shutdown
const handleShutdown = async (signal: string) => {
    console.info(`${signal} signal received.`);
    console.info('Shutting down server... 👋');
    await server.close();
    await prisma.$disconnect();
    //   await new Promise((resolve) => redisClient.quit(() => resolve(null)));
    process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
