import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

export const keyRouter = express.Router()

keyRouter.get('/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
})