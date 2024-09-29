import {Router} from 'express'
import {
    registerUser,
    logOutUser,
    loginUser
} from '../controllers/user.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);

export default router