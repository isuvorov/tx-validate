export interface Transaction {
  id: number;
  orderId: number;
  amount: number;
  txType: 'Bet' | 'Win';
}

export type UserBalance = number;

export interface ValidatedTransaction extends Transaction {
  valid: boolean;
}

// NOTE: обсуждаемо, нужно ли возвращать в таком формате или отдавать "по минимому"
// пока единственный аргумент за такой формат - удобен для покрытия тестов
export type Result = {
  transactions: ValidatedTransaction[];
  balance: UserBalance;
};
