import { Router } from 'express';
import {
	postUrl,
	getUrlById,
	getUrlOpen,
	deleteUrlById,
} from '../constrollers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', postUrl);
urlRouter.get('/urls/:id', getUrlById);
urlRouter.get('/urls/open/:shortUrl', getUrlOpen);
urlRouter.delete('/urls/:id', deleteUrlById);

export default urlRouter;
