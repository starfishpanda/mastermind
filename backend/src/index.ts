import * as dotenv from 'dotenv'
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import apiRouter from './routes/apiRoutes.js'
import authRouter from './routes/authRoutes.js'
import mongoose from 'mongoose'
import path from 'path'
import http from 'http'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { config } from './config/config.js'
import { AppError } from './types/AppError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const HOST: string = process.env.HOST || '0.0.0.0'
const MODE: string = process.env.MODE || ''
const PORT: number = Number(config.port)

let server: http.Server | null = null

// Functions to start and stop server gracefully, and establish MongoDB connection
export const startServer = async (): Promise<http.Server | undefined> => {
  if (server) {
    console.log('Server already started')
    return
  }

  // Connect to MongoDB
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(config.mongodb.uri)
    console.log(`Connected to MongoDB at URI ${config.mongodb.uri}.`)
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error}`)
    process.exit(1)
  }

  // Start Server
  server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`)
  })
}

export const stopServer = async (): Promise<void> => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(`Error closing server: ${err}`)
        return
      }
      console.log('Server successfully closed.')
      server = null
    })
  }

  try {
    console.log('Disconnecting from MongoDB...')
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  } catch (error) {
    console.log(`Failed to disconnect from MongoDB: ${error}`)
  }
}

app.use('/api', apiRouter) // use a router for api routes
app.use('/auth', authRouter)

if (MODE === 'production') {
  startServer()
  app.use(express.static(path.join(__dirname, 'dist/client')))
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist/client/index.html'))
  })
} else if (MODE === 'testing') {
  // Jest will start server in test file
  app.get('/', (req: Request, res: Response) => {
    res.send('Mastermind Testing')
  })
} else {
  // Vite serves the static files for development hot reloading
  startServer()
}

// global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.status || 500
  const errorMessage = err.message || 'An unexpected error occurred.'
  console.error(
    `Status: ${statusCode}, Message: ${errorMessage}, Route: ${req.path}, Method: ${req.method}`
  )
  res.status(statusCode).json({ message: errorMessage })
})

const gracefulShutdown = async (sig: string) => {
  console.log(`Received ${sig}. Gracefully shutting server down...`)
  await stopServer()
  console.log('Http server shutdown complete.')
  process.exit(0)
}

// SIGTERM, SIGINT, uncaught exceptions, and uncaught rejections
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('uncaughtException', (err: AppError) => {
  console.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason: object | null | undefined, promise: Promise<unknown>) => {
  console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
  process.exit(1)
})

export default app
