import connection from '../postgres.js/postgres.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';

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

		const existe = await connection.query(
			'SELECT users.id FROM users WHERE email = $1;',
			[email]
		);

		if (existe.rows.length !== 0) {
			return res.status(409).send('email já cadastrado');
		}
		await connection.query(
			'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
			[name, email, hash]
		);
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

		const existe = await connection.query(
			'SELECT users.id, users.password FROM users WHERE email = $1;',
			[email]
		);

		if (
			!existe ||
			bcrypt.compareSync(password, existe.rows[0].password) === false
		) {
			return res.sendStatus(401);
		}

		const token = uuid();
		await connection.query(
			'INSERT INTO session ("userId", token) VALUES ($1, $2);',
			[existe.rows[0].id, token]
		);

		res.status(200).send(token);
	} catch (error) {
		console.log(error);
	}
};

export { postSignUp, postSignIn };
