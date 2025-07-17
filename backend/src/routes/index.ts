import { Router } from 'express'
import { musicRoutes } from './music.js'

const routes = Router()

routes.use('/v1/music', musicRoutes)

export { routes }
