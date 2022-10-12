import connection from '../postgres.js/postgres.js';
import { nanoid } from 'nanoid';

const postUrl = async (req, res) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	let shortUrl = req.body;
	shortUrl = nanoid();

	console.log(token);
	res.status(201).send(shortUrl);
};

export { postUrl };
