import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

// import AppError from '../errors/AppError';
interface RequestDto {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDto): Promise<void> {
    const transRepository = getRepository(Transaction);

    transRepository.delete(id);
  }
}

export default DeleteTransactionService;
