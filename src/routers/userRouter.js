import { Router } from 'express';
import {
	postSignUp,
	postSignIn,
	getRanking,
	getMe,
} from '../constrollers/userController.js';

const userRouter = Router();

userRouter.post('/signup', postSignUp);
userRouter.post('/signin', postSignIn);
userRouter.get('/ranking', getRanking);
userRouter.get('/users/me', getMe);

export default userRouter;
