import type { Result, Transaction, UserBalance } from './types';
import { ValidatedTransaction } from './types';

const comparator = (a: Transaction, b: Transaction): number => {
  if (a.id > b.id) {
    return 1;
  }
  if (a.id < b.id) {
    return -1;
  }
  return 0;
};

const applyTransactionToBalance = (transaction: Transaction, balance: UserBalance): UserBalance =>
  transaction.txType === 'Bet' ? balance - transaction.amount : balance + transaction.amount;

export function txValidate(transactions: Transaction[], initBalance: UserBalance = 0): Result {
  const processedTransactions: ValidatedTransaction[] = [];
  const invalidOrderIds: Set<Transaction['orderId']> = new Set();
  let currentBalance: UserBalance = initBalance;

  transactions.sort(comparator);

  transactions.forEach((transaction: Transaction) => {
    if (invalidOrderIds.has(transaction.orderId)) {
      processedTransactions.push({ ...transaction, valid: false });
      return;
    }

    const updatedBalance: UserBalance = applyTransactionToBalance(transaction, currentBalance);
    if (updatedBalance < 0) {
      invalidOrderIds.add(transaction.orderId);
      processedTransactions.push({ ...transaction, valid: false });
      return;
    }

    const idIsDuplicate = processedTransactions.some((obj) => obj.id === transaction.id);
    if (idIsDuplicate) {
      processedTransactions.push({ ...transaction, valid: false });
      return;
    }

    currentBalance = updatedBalance;
    processedTransactions.push({ ...transaction, valid: true });
  });

  return {
    transactions: processedTransactions,
    balance: currentBalance,
  };
}
