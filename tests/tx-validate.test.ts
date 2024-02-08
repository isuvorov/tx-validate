/* eslint-disable import/no-extraneous-dependencies */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { txValidate } from '../src';
import type { ValidatedTransaction } from '../src/types';

const test = suite('txValidate');
const removeValidation = (trancastions: ValidatedTransaction[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trancastions.map(({ valid, ...tx }) => tx);

// NOTE: Дисклеймер, тесты написаны из моего понимания задачи + здравого смысла
// Очень может быть, что я не правильно понял условие. Ксли что не так - критикуйте, обсуждайте, предлагайте альтернативы

test('typical usage', () => {
  const initBalance = 100;
  const trancastions: ValidatedTransaction[] = [
    { id: 1, orderId: 1, amount: 100, txType: 'Bet', valid: true }, // 000
    { id: 2, orderId: 2, amount: 200, txType: 'Win', valid: true }, // 200
    { id: 3, orderId: 3, amount: 300, txType: 'Bet', valid: false }, // 200 (invalid -100)
    { id: 4, orderId: 4, amount: 400, txType: 'Win', valid: true }, // 600
    { id: 5, orderId: 5, amount: 500, txType: 'Bet', valid: true }, // 100
    { id: 6, orderId: 6, amount: 600, txType: 'Win', valid: true }, // 700
  ];
  const resultBalance = 700;
  const input = removeValidation(trancastions);
  const result = txValidate(input, initBalance);
  assert.equal(result.balance, resultBalance);
  assert.equal(result.transactions, trancastions);
  // Проверка на то, что input не изменен
  assert.equal(input, removeValidation(trancastions));
});
test('empty transactions', () => {
  const initBalance = 100;
  const trancastions: ValidatedTransaction[] = [];
  const resultBalance = 100;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const input = trancastions.map(({ valid, ...tx }) => tx);
  const result = txValidate(input, initBalance);
  assert.equal(result.balance, resultBalance);
  assert.equal(result.transactions, trancastions);
});

test('negative balance', () => {
  const initBalance = 50;
  const trancastions: ValidatedTransaction[] = [
    { id: 1, orderId: 1, amount: 100, txType: 'Bet', valid: false }, // 50
    { id: 2, orderId: 2, amount: 100, txType: 'Bet', valid: false }, // 50
  ];
  const resultBalance = 50;
  const input = removeValidation(trancastions);
  const result = txValidate(input, initBalance);
  assert.equal(result.balance, resultBalance);
  assert.equal(result.transactions, trancastions);
});

test('duplicate ids', () => {
  const initBalance = 500;
  const trancastions: ValidatedTransaction[] = [
    { id: 1, orderId: 1, amount: 100, txType: 'Bet', valid: true }, // 400
    { id: 1, orderId: 2, amount: 100, txType: 'Bet', valid: false }, // 400 (invalid duplicate)
  ];
  const resultBalance = 400;
  const input = removeValidation(trancastions);
  const result = txValidate(input, initBalance);
  assert.equal(result.balance, resultBalance);
  assert.equal(result.transactions, trancastions);
});

test('negative balance then same orderId is not valid', () => {
  const initBalance = 50;
  const trancastions: ValidatedTransaction[] = [
    { id: 1, orderId: 1, amount: 100, txType: 'Bet', valid: false }, // 50
    { id: 2, orderId: 1, amount: 50, txType: 'Bet', valid: false }, // 50
  ];
  const resultBalance = 50;
  const input = removeValidation(trancastions);
  const result = txValidate(input, initBalance);
  assert.equal(result.balance, resultBalance);
  assert.equal(result.transactions, trancastions);
});

test.run();
