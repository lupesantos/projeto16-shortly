import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import urlRouter from './routers/urlRouter.js';

const server = express();
server.use(cors());
server.use(express.json());

server.use(userRouter);
server.use(urlRouter);

server.get('/status', (req, res) => {
	console.log('ok');
	res.send('ok');
});

server.listen(process.env.PORT, () => {
	console.log('Server running on port ' + process.env.PORT);
});
