import express from 'express'
import path from 'path'
import { v1Route } from './v1'

export const route = (app) => {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
  app.use('/v1', v1Route)
}
