import connection from '../postgres.js/postgres.js';
import Joi from 'joi';

const categorieSchema = Joi.object({
	name: Joi.string().required(),
});

const getCategories = async (req, res) => {
	const categorias = await connection.query('SELECT * FROM categories;');
	res.send(categorias.rows);
};

export { getCategories };
