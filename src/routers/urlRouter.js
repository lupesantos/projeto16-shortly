import { Router } from 'express';
import { postUrl } from '../constrollers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', postUrl);

export default urlRouter;
