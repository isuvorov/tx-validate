import type { Result, Transaction, UserBalance } from './types';

export function txValidate(transactions: Transaction[], initBalance: UserBalance = 0): Result {
  let balance = initBalance;
  const sorted = transactions.sort((a, b) => (a.id > b.id ? 1 : -1));
  const invalidOrderIds = new Set<number>();

  const res = sorted.map((e) => {
    if (e.txType === 'Bet') {
      balance -= e.amount;
    } else {
      balance += e.amount;
    }

    if (balance < 0) {
      invalidOrderIds.add(e.orderId);
      return {
        ...e,
        valid: false,
      };
    }

    if (invalidOrderIds.has(e.orderId)) {
      return {
        ...e,
        valid: false,
      };
    }

    // eslint-disable-next-line no-shadow
    const transactionIds = sorted.map((e) => e.id);
    if (transactionIds.filter((id) => id === e.id).length > 1) {
      return {
        ...e,
        valid: false,
      };
    }

    return {
      ...e,
      valid: true,
    };
  });

  return {
    transactions: res,
    balance,
  };
}
