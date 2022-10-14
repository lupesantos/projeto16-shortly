import connection from '../postgres.js/postgres.js';
import { nanoid } from 'nanoid';
import Joi from 'joi';

const urlSchema = Joi.object({
	url: Joi.string()
		.required()
		.uri()
		.regex(
			/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		),
});

const postUrl = async (req, res) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401);
	}

	const { url } = req.body;
	const token = req.headers.authorization?.replace('Bearer ', '');
	const validation = urlSchema.validate({ url }, { abortEarly: false });
	const existe = await connection.query(
		'SELECT * FROM session WHERE token = $1;',
		[token]
	);

	try {
		if (validation.error) {
			const errors = validation.error.details
				.map((value) => value.message)
				.join(',');

			return res.status(422).send(errors);
		}
		if (existe.rows.length === 0) {
			return res.sendStatus(401);
		}

		let shortUrl = req.body;
		shortUrl = nanoid();

		const userId = await connection.query(
			'SELECT session."userId" FROM session WHERE token = $1 ;',
			[token]
		);

		console.log(userId.rows[0].userId);

		await connection.query(
			'INSERT INTO links ("userId", url, "shortUrl") VALUES ($1, $2, $3);',
			[userId.rows[0].userId, url, shortUrl]
		);

		res.status(201).send({ shortUrl });
	} catch (error) {
		console.log(error);
	}
};

const getUrlById = async (req, res) => {
	const { id } = req.params;

	const urlById = await connection.query(
		'SELECT links.id, links."shortUrl", links.url FROM links WHERE id = $1;',
		[id]
	);

	if (urlById.rows.length === 0) {
		return res.sendStatus(404);
	}

	res.status(200).send(urlById.rows[0]);
};

const getUrlOpen = async (req, res) => {
	const { shortUrl } = req.params;
	console.log(shortUrl);

	const url = await connection.query(
		'SELECT links.url, links.id FROM links WHERE "shortUrl" = $1',
		[shortUrl]
	);

	if (url.rows.length === 0) {
		return res.sendStatus(404);
	}

	await connection.query('INSERT INTO visits ("urlId") VALUES ($1);', [
		url.rows[0].id,
	]);
	res.redirect(url.rows[0].url);
};

const deleteUrlById = async (req, res) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401);
	}
	const { id } = req.params;
	const token = req.headers.authorization?.replace('Bearer ', '');
	const existe = await connection.query(
		'SELECT * FROM session WHERE token = $1;',
		[token]
	);
	const existeLink = await connection.query(
		'SELECT * FROM links WHERE id = $1;',
		[id]
	);

	try {
		if (existeLink.rows.length === 0) {
			return res.sendStatus(404);
		}
		if (existe.rows.length === 0) {
			return res.sendStatus(401);
		}

		const pertence = await connection.query(
			'SELECT session.token FROM session JOIN links on links."userId" = session."userId" WHERE links.id = $1;',
			[id]
		);
		console.log(pertence.rows[0].token);
		console.log(token);

		if (token !== pertence.rows[0].token) {
			res.sendStatus(401);
		}
		await connection.query('DELETE FROM visits WHERE "urlId" = $1;', [id]);
		await connection.query('DELETE FROM links WHERE id = $1;', [id]);

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
	}
};

export { postUrl, getUrlById, getUrlOpen, deleteUrlById };
