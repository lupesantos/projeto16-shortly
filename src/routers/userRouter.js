import { Router } from 'express';
import { postSignUp, postSignIn } from '../constrollers/userController.js';

const userRouter = Router();

userRouter.post('/signup', postSignUp);
userRouter.post('/signin', postSignIn);

export default userRouter;
