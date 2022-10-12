import express from 'express';
import cors from 'cors';
import categoriesRouter from '../src/routers/categoriesRouter.js';
import userRouter from './routers/userRouter.js';
import urlRouter from './routers/urlRouter.js';

const server = express();
server.use(cors());
server.use(express.json());

server.use(categoriesRouter);
server.use(userRouter);
server.use(urlRouter);

server.get('/status', (req, res) => {
	console.log('ok');
	res.send('ok');
});

server.listen(4000, () => {
	console.log('Magic happens on 4000!');
});
