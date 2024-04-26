import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRoutes';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import session from 'express-session';
import MongoStore from 'connect-mongo';


const app: Express = express();
app.use(express.json());
app.use(express.urlencoded( { extended: true }));
const MODE = process.env.NODE_ENV || 'development';
const HOST = 'localhost';
const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const URI = process.env.DATABASE_URI || 'mongodb://localhost:27017';

let server: http.Server | null = null;

// Functions to start and stop server gracefully, and establish MongoDB connection
export const startServer = async (): Promise<http.Server | undefined> => {
  if (server) {
    console.log('Server already started');
    return;
  }

  // Connect to MongoDB
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(URI);
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  }

  server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
  });
};

export const stopServer = async (): Promise<void> => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(`Error closing server: ${err}`);
        return;
      }
      console.log('Server successfully closed.');
      server = null;
    });
  }

  try {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.log(`Failed to disconnect from MongoDB: ${error}`);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);


app.use('/api', apiRouter); // use a router for api routes

startServer();
// For serving index.html in production
// app.use('/client', express.static(path.join(__dirname, '../../dist/client')));
// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
// });

// Check server working
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });


// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'An unexpected error occurred.';
  // console.log(`Status: ${statusCode}, Message: ${errorMessage}, Route: ${req.path}, Method: ${req.method}`)

  res.status(statusCode).json({ message: errorMessage });
});


const gracefulShutdown = async (sig: string) => {
  console.log(`Received ${sig}. Gracefully shutting server down...`);
  await stopServer();
  console.log('Http server shutdown complete.');
  process.exit(0);
};

// SIGTERM, SIGINT, uncaught exceptions, and uncaught rejections
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err: Error) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason: object | null | undefined, promise: Promise<any>) => {
  console.log(`Unhanlded Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

export default app;