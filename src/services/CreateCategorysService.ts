// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const existCategory = await categoryRepository.findOne({
      where: { title },
    });

    if (existCategory) {
      throw new AppError('Category already exist!');
    }

    const category = categoryRepository.create({
      title,
    });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
