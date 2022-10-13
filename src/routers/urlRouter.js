import { Router } from 'express';
import {
	postUrl,
	getUrlById,
	getUrlOpen,
} from '../constrollers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', postUrl);
urlRouter.get('/urls/:id', getUrlById);
urlRouter.get('/urls/open/:shortUrl', getUrlOpen);

export default urlRouter;
