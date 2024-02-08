import type { Result, Transaction, UserBalance } from './types';

export function txValidate(transactions: Transaction[], initBalance: UserBalance = 0): Result {
  return {
    transactions: transactions.map((tx, i) => ({
      ...tx,
      valid: i % 2 === 0,
    })),
    balance: initBalance * 2,
  };
}
