import express from 'express'

export const keyRouter = express.Router()

keyRouter.get('/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'ARW-66Agk4xSL4xDNiMcsE5MV2Lgk6fNPZp7QZ17fvYPi9cta0XDY1Z5UTL2--gPu69rd1FWqLqs_xYh' })
})