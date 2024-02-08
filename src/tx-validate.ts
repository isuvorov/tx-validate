import type { Result, Transaction, UserBalance } from './types';

export function txValidate(transactions: Transaction[], initBalance: UserBalance = 0): Result {
  let accountBalance = initBalance;
  const transactionIds = new Set<number>();
  const invalidTransactionsOrderIds = new Set<number>();
  const sortedTransaction = transactions.sort((a, b) => a.id - b.id);

  // eslint-disable-next-line no-restricted-syntax
  for (const transaction of sortedTransaction) {
    if (transactionIds.has(transaction.id)) {
      // @ts-ignore
      transaction.valid = false;
    }

    if (invalidTransactionsOrderIds.has(transaction.orderId)) {
      // @ts-ignore
      transaction.valid = false;
    }

    // @ts-ignore
    if (transaction.valid) {
      if (transaction.txType === 'Bet') {
        accountBalance -= transaction.amount;
      }

      if (transaction.txType === 'Win') {
        accountBalance += transaction.amount;
      }
    }

    if (accountBalance < 0) {
      // @ts-ignore
      transaction.valid = false;
      invalidTransactionsOrderIds.add(transaction.id);
    }

    transactionIds.add(transaction.id);
  }

  return {
    // @ts-ignore
    transactions: sortedTransaction,
    balance: accountBalance,
  };
}
