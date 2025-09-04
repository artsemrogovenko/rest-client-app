import { expect, test } from 'vitest';

test('test pre push hook', () => {
  const text = 'abc';
  const count = 2;
  expect(text.repeat(count)).toBe(text.concat(text));
});
