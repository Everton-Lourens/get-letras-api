import express from 'express'
import { MusicController } from '../controllers/MusicController.js'
import { validationFilter, validationUUID } from '../middlewares/validate.js'

const musicRoutes = express.Router()
const musicController = new MusicController()

// Routes
musicRoutes.get('/search', validationFilter, async (req, res, next) => {
    //Exemplo: http://localhost:9999/v1/music/search?text=fernandinho+seu+sangue&title=true&lyrics=true
    try {
        await musicController.getLyric(req, res);
    } catch (err) {
        next(err);
    }
})
musicRoutes.get('/get', validationUUID, async (req, res, next) => {
    //Exemplo: http://localhost:9999/v1/music/get?id=f85e9cc4-d4eb-41a4-955e-7587d8aa7a31
    try {
        await musicController.getLyricById(req, res);
    } catch (err) {
        next(err);
    }
})
export { musicRoutes }