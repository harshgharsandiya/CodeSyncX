import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { User } from '../models/user.model'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, me)

export default router
