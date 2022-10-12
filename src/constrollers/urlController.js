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

		res.status(201).send(shortUrl);
	} catch (error) {
		console.log(error);
	}
};

export { postUrl };
