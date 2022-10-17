import { nanoid } from 'nanoid';
import Joi from 'joi';
import {
	deleteUrlById2,
	findUserByToken,
	insertShortLink,
	inserUrlInVisits,
	pertenceLinkToUser,
	selectLinkById,
	selectUrlByShortUrl,
	selectUserIdByToken,
} from '../repositories/urlRepositories.js';

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
	const existe = await findUserByToken(token);

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

		const userId = await selectUserIdByToken(token);
		await insertShortLink(userId, url, shortUrl);

		res.status(201).send({ shortUrl });
	} catch (error) {
		console.log(error);
	}
};

const getUrlById = async (req, res) => {
	const { id } = req.params;
	const urlById = await selectLinkById(id);

	if (urlById.rows.length === 0) {
		return res.sendStatus(404);
	}

	res.status(200).send(urlById.rows[0]);
};

const getUrlOpen = async (req, res) => {
	const { shortUrl } = req.params;
	const url = await selectUrlByShortUrl(shortUrl);

	if (url.rows.length === 0) {
		return res.sendStatus(404);
	}

	await inserUrlInVisits(url);
	res.redirect(url.rows[0].url);
};

const deleteUrlById = async (req, res) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401);
	}
	const { id } = req.params;
	const token = req.headers.authorization?.replace('Bearer ', '');
	const existe = await findUserByToken(token);
	const existeLink = await selectLinkById(id);

	try {
		if (existeLink.rows.length === 0) {
			return res.sendStatus(404);
		}
		if (existe.rows.length === 0) {
			return res.sendStatus(401);
		}
		const pertence = await pertenceLinkToUser(id);

		if (token !== pertence.rows[0].token) {
			return res.sendStatus(401);
		}
		await deleteUrlById2(id);

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
	}
};

export { postUrl, getUrlById, getUrlOpen, deleteUrlById };
