import { expect, test } from 'vitest';
import {
  collectVariablesNames,
  findValue,
  isNotMissedVariables,
  isValidBrackets,
} from '~/restful-client/utils';

test('Extract variable from string', () => {
  const pattern = '{{abc}}1';
  const count = 3;
  const input = pattern.repeat(count);
  const result = collectVariablesNames(input);
  expect(result.length).toBe(count);
  expect(result.every((value) => value === 'abc')).toBe(true);
});

test('No extracted variable from string', () => {
  const pattern = '{abc}1';
  const count = 3;
  const input = pattern.repeat(count);
  const result = collectVariablesNames(input);
  expect(result.length).toBe(0);
});

test('Get value on variable name', () => {
  const list = {
    '1': '{{pseudo2}}',
    '2': '{{pseudo}}',
  };
  const wrongCase = findValue('pse', list);
  const validCase = findValue('pseudo', list);

  expect(wrongCase).toBe(undefined);
  expect(validCase).toBe('2');
});

test('Check contain variables in str', () => {
  const list = {
    '1': '{{pseudo2}}',
    '2': '{{pseudo}}',
  };
  const wrongCase = isNotMissedVariables('{{pse}}', list);
  const validCase = isNotMissedVariables('{{pseudo2}}', list);

  expect(wrongCase.isValid).toBe(false);
  expect(validCase.isValid).toBe(true);
});

test('Not found if empty list', () => {
  const list = {};
  const checked = isNotMissedVariables('{{pse}}', list);
  expect(checked.isValid).toBe(false);
  expect(checked.notFoundVars).toStrictEqual(['pse']);
});

test('Check syntax', () => {
  const list = [
    '{{pseudo',
    'pseudo}}',
    '{pseudo}',
    '{pseudo}}',
    '{{pseudo}',
    '{{{pseudo}}}',
    '{{pseudo}}}',
  ];
  expect(list.every((value) => isValidBrackets(value))).toBe(false);
  expect(isValidBrackets('{{pseudo}}')).toBe(true);
});
