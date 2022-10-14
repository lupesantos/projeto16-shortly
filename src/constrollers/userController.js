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

		res.status(200).send({ token });
	} catch (error) {
		console.log(error);
	}
};

const getRanking = async (req, res) => {
	const ranking = await connection.query(
		`SELECT
			"userId",
			name,
			COUNT("userId") AS "linksCount",
    		SUM("viewCount") AS "visitCount"
  		FROM
			(SELECT 
				users.id AS "userId", 
    			users.name, 
    			links.id AS "urlId", 
    			COUNT(links.id) AS "viewCount"
			FROM users 
			LEFT JOIN links 
      		  ON users.id = links."userId" 
    		LEFT JOIN visits 
      		  on links.id = visits."urlId"
			GROUP BY users.id, links.id) AS t1 
		GROUP BY t1.name, t1."userId"
		ORDER BY "visitCount" DESC, 
		"linksCount" DESC LIMIT 10;`
	);

	res.status(200).send(ranking.rows);
};

const getMe = async (req, res) => {
	if (!req.headers.authorization) {
		return res.sendStatus(401);
	}
	const token = req.headers.authorization?.replace('Bearer ', '');
	const existe = await connection.query(
		'SELECT * FROM session WHERE token = $1;',
		[token]
	);

	try {
		if (existe.rows.length === 0) {
			return res.sendStatus(401);
		}

		const me = await connection.query(
			`SELECT
				users.id,
				users.name,
				COUNT(users.id) AS "visitCount"
	   		FROM users
	   		JOIN session
		 	  ON users.id = session."userId"
	   		JOIN links
			  ON users.id = links."userId"
	   		JOIN visits
			  ON visits."urlId" = links.id
		 	WHERE users.id = $1
	   		GROUP BY users.id
		;`,
			[existe.rows[0].userId]
		);

		const shortenedUrls = await connection.query(
			`SELECT 
				links.id AS id, 
				links."shortUrl" AS "shortUrl", 
				links.url AS url, 
				COUNT(links.id) AS "visitCount"
			FROM users 
			JOIN links 
			  ON users.id = links."userId" 
			JOIN visits 
			  on links.id = visits."urlId"
			WHERE users.id = $1
			GROUP BY users.id, links.id
		;`,
			[existe.rows[0].userId]
		);
		me.rows[0].shortenedUrls = shortenedUrls.rows;

		res.status(200).send(me.rows[0]);
	} catch (error) {
		console.log(error);
	}
};

export { postSignUp, postSignIn, getRanking, getMe };
