import connection from '../postgres.js/postgres.js';

async function findUserByToken(token) {
	const existe = await connection.query(
		'SELECT * FROM session WHERE token = $1;',
		[token]
	);
	return existe;
}

async function selectUserIdByToken(token) {
	const userId = await connection.query(
		'SELECT session."userId" FROM session WHERE token = $1 ;',
		[token]
	);
	return userId;
}

export { findUserByToken, selectUserIdByToken };
