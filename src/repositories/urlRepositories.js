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

async function insertShortLink(userId, url, shortUrl) {
	await connection.query(
		'INSERT INTO links ("userId", url, "shortUrl") VALUES ($1, $2, $3);',
		[userId.rows[0].userId, url, shortUrl]
	);
}

async function selectLinkById(id) {
	const urlById = await connection.query(
		'SELECT links.id, links."shortUrl", links.url FROM links WHERE id = $1;',
		[id]
	);
	return urlById;
}

async function pertenceLinkToUser(id) {
	const pertence = await connection.query(
		'SELECT session.token FROM session JOIN links on links."userId" = session."userId" WHERE links.id = $1;',
		[id]
	);
	return pertence;
}

async function selectUrlByShortUrl(shortUrl) {
	const url = await connection.query(
		'SELECT links.url, links.id FROM links WHERE "shortUrl" = $1',
		[shortUrl]
	);

	return url;
}

async function inserUrlInVisits(url) {
	await connection.query('INSERT INTO visits ("urlId") VALUES ($1);', [
		url.rows[0].id,
	]);
}

async function deleteUrlById2(id) {
	await connection.query('DELETE FROM visits WHERE "urlId" = $1;', [id]);
	await connection.query('DELETE FROM links WHERE id = $1;', [id]);
}

export {
	findUserByToken,
	selectUserIdByToken,
	insertShortLink,
	selectLinkById,
	selectUrlByShortUrl,
	inserUrlInVisits,
	pertenceLinkToUser,
	deleteUrlById2,
};
