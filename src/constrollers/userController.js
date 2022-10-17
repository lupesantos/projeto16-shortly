import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import {
	findUser,
	insertUser,
	insertUserSession,
	getRanking2,
	findUserByToken,
	findUserNameByToken,
	findMe,
	shortenedUrls2,
} from '../repositories/userRepositories.js';

const signUpSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(12),
	confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
});

const signInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(12),
});

const postSignUp = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	const validation = signUpSchema.validate(
		{ name, email, password, confirmPassword },
		{ abortEarly: false }
	);

	try {
		if (validation.error) {
			const errors = validation.error.details
				.map((value) => value.message)
				.join(',')
				.replace('[ref:password]', 'equal to password');

			return res.status(422).send(errors);
		}
		const existe = await findUser(email);

		if (existe.rows.length !== 0) {
			return res.status(409).send('email já cadastrado');
		}
		await insertUser(name, email, hash);
		res.sendStatus(201);
	} catch (error) {
		console.log(error);
	}
};

const postSignIn = async (req, res) => {
	const { email, password } = req.body;
	const validation = signInSchema.validate(
		{ email, password },
		{ abortEarly: false }
	);

	try {
		if (validation.error) {
			const errors = validation.error.details
				.map((value) => value.message)
				.join(',');

			return res.status(422).send(errors);
		}
		const existe = await findUser(email);

		if (
			!existe ||
			bcrypt.compareSync(password, existe.rows[0].password) === false
		) {
			return res.sendStatus(401);
		}

		const token = uuid();
		await insertUserSession(existe, token);

		res.status(200).send({ token });
	} catch (error) {
		console.log(error);
	}
};

const getRanking = async (req, res) => {
	const ranking = await getRanking2();
	res.status(200).send(ranking.rows);
};

const getMe = async (req, res) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401);
	}
	const token = req.headers.authorization?.replace('Bearer ', '');
	const existe = await findUserByToken(token);

	try {
		if (existe.rows.length === 0) {
			return res.sendStatus(401);
		}
		const me = await findMe(existe);
		const name = await findUserNameByToken(token);
		if (me.rows.length === 0) {
			const user = {
				id: existe.rows[0].userId,
				name: name.rows[0].name,
				visitCount: 0,
				shortenedUrls: 0,
			};
			return res.status(409).send(user);
		}

		const shortenedUrls = await shortenedUrls2(existe);
		me.rows[0].shortenedUrls = shortenedUrls.rows;

		res.status(200).send(me.rows[0]);
	} catch (error) {
		console.log(error);
	}
};

export { postSignUp, postSignIn, getRanking, getMe };
