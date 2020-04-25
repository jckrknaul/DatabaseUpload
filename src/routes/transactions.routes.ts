import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
// import multer from 'multer';
// import path from 'path';
// import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
// const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance(transactions);

  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionsService = new CreateTransactionService();
  const newTransaction = await createTransactionsService.execute({
    title,
    value,
    type,
    category,
  });
  return response.status(200).json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transService = new DeleteTransactionService();
  await transService.execute({ id });
  response.status(204).send();
});

/*
transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
     const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      request.file.filename,
    );

    const importTransactionsService = new ImportTransactionsService();
    const transactions = await importTransactionsService.execute(csvFilePath);

    const createTransactionsService = new CreateTransactionService();
    const savedTransactions = await createTransactionsService.saveTransactions(
      transactions,
    );

    return response.status(200).json(savedTransactions);
  },
); */

export default transactionsRouter;
