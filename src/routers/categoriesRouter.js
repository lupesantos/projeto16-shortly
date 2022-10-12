import { Router } from 'express';
import { getCategories } from '../constrollers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);

export default categoriesRouter;
