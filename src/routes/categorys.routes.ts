import { Router } from 'express';
import { getRepository } from 'typeorm';
import CreateCategoryService from '../services/CreateCategorysService';
import Category from '../models/Category';

const categorysRouter = Router();

categorysRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const categoryService = new CreateCategoryService();

  const category = await categoryService.execute({ title });

  return response.json(category);
});

categorysRouter.get('/', async (request, response) => {
  const categoryRepository = getRepository(Category);

  return response.json(await categoryRepository.find());
});

export default categorysRouter;
