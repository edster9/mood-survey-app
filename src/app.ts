import express, { NextFunction, Request, Response } from 'express'
import { Database } from 'sqlite'
import helmet from 'helmet'
import routes from './routes'

// Create express server
const app = express()

// Helment middleware for enhanced security
app.use(helmet())

// Parse body middle ware for accepting json body
app.use(express.json())

// Setup all routes
routes(app)

export default app
