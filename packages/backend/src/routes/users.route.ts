import express from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { banMiddleware } from '../middlewares/ban.middleware.js'
import { bodyValidatorMiddleware } from '../middlewares/bodyValidator.middleware.js'
import { paramsValidatorMiddleware } from '../middlewares/paramsValidator.middleware.js'
import { permissionMiddleware } from '../middlewares/permission.middleware.js'
import { idSchema } from '../validationSchemas/id.scheme.js'
import { loginSchema } from '../validationSchemas/login.schema.js'
import { registerSchema } from '../validationSchemas/register.schema.js'

const Router = express.Router()

// i dunno how to get rid of "as any" but it throws an error without those widepeepoSad

Router.post(
    '/register',
    bodyValidatorMiddleware(registerSchema),
    UsersController.register
)
Router.post(
    '/login',
    bodyValidatorMiddleware(loginSchema),
    UsersController.login
)
Router.get('/fetch-data', authMiddleware, UsersController.fetchUserData)
Router.get(
    '/user/:userId',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.getUserProfile as any
)
Router.put(
    '/user/:userId/follow',
    authMiddleware,
    banMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.follow as any
)
Router.post(
    '/user/:userId/report',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.reportUser as any
)
Router.get(
    '/user/:userId?/roles',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.getUserRoles as any
)
Router.get(
    '/user/:userId?/events',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.getUserEvents as any
)
Router.get(
    '/user/:userId?/runs',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.getUserRuns as any
)
Router.get(
    '/user/:userId?/reviews',
    authMiddleware,
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.getReviewsAboutUser as any
)
Router.post(
    '/user/:userId/ban',
    authMiddleware,
    permissionMiddleware('can_ban'),
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.ban
)
Router.post(
    '/user/:userId/unban',
    authMiddleware,
    permissionMiddleware('can_ban'),
    paramsValidatorMiddleware(idSchema, ['userId']),
    UsersController.unban
)

export const UsersRouter = Router
