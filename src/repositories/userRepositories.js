import connection from '../postgres.js/postgres.js';

async function findUser(email) {
	const existe = await connection.query(
		'SELECT users.name, users.id, users.password FROM users WHERE email = $1;',
		[email]
	);
	return existe;
}

async function findUserNameByToken(token) {
	const name = await connection.query(
		`SELECT users.name 
        FROM users JOIN 
        session ON users.id = session."userId" 
        WHERE token = $1;`,
		[token]
	);
	return name;
}
async function insertUser(name, email, hash) {
	await connection.query(
		'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
		[name, email, hash]
	);
}

async function insertUserSession(existe, token) {
	await connection.query(
		'INSERT INTO session ("userId", token) VALUES ($1, $2);',
		[existe.rows[0].id, token]
	);
}

async function getRanking2() {
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
	return ranking;
}

async function findUserByToken(token) {
	const existe = await connection.query(
		'SELECT * FROM session WHERE token = $1;',
		[token]
	);
	return existe;
}

async function findMe(existe) {
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
	return me;
}
async function shortenedUrls2(existe) {
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
	return shortenedUrls;
}

export {
	findUser,
	insertUser,
	insertUserSession,
	getRanking2,
	findUserByToken,
	findUserNameByToken,
	findMe,
	shortenedUrls2,
};
