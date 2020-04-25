// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoryRepository';
import CreateCategoryService from './CreateCategorysService';
import AppError from '../errors/AppError';

interface RequestTDO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestTDO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const transactions = await transactionsRepository.find();
      const { total } = await transactionsRepository.getBalance(transactions);

      if (total < value) {
        throw new AppError(
          'It´s not possible create a outcome transaction when total is less then value!',
          400,
        );
      }
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const categoryFound = await categoriesRepository.findOne({
      where: { title: category },
    });

    let newCategory;

    if (!categoryFound) {
      const createCategoryService = new CreateCategoryService();
      newCategory = await createCategoryService.execute({ title: category });
    } else {
      newCategory = categoryFound;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }

  public async saveTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const savedTransactions: Transaction[] = [];

    transactions.forEach(async transaction => {
      const newTransaction = await this.execute({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: transaction.category.title,
      });

      savedTransactions.push(newTransaction);
    });

    return savedTransactions;
  }
}

export default CreateTransactionService;
