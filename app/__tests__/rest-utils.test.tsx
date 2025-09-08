import { expect, test } from 'vitest';
import {
  collectVariablesNames,
  collectVariables,
  findValue,
  isNotMissedVariables,
  isValidBrackets,
  ejectVariables,
  convertValues,
} from '~/restful-client/utils';

const storageList = {
  '{{pseudo2}}': '1',
  '{{pseudo}}': '2',
};

const storageList2 = { sample: 'header' };

test('Get variable in list', () => {
  const wrongCase = findValue('pse', storageList);
  const validCase = findValue('pseudo', storageList);

  expect(wrongCase).toBe(undefined);
  expect(validCase).toBe('{{pseudo}}');
});

const badStrings = [
  'a{{pseudo',
  'pseudo}}',
  '{pseudo}',
  '{pseudo}}',
  '}}pseudo}}',
  '}{pseudo}',
  '}}{pseudo}}{{',
  'a{{pseudo}',
  '{{{pseudo}}a}',
  'a{{pseudo}}}',
];
const validStrings = [
  '{{pseudo}}',
  'abc{{pseudo}}abc',
  'abc{{pseudo}}',
  '{{pseudo}}abc',
  '{{pseudo}}abc{{pseudo}}',
  'abc{{pseudo}}abc{{pseudo}}',
];

test('Collect variables from string', () => {
  const string = 'a{{abc}}a';
  const count = 3;
  const input = string.repeat(count);
  const result = collectVariables(input);
  expect(result).toStrictEqual(['{{abc}}', '{{abc}}', '{{abc}}']);

  expect(
    validStrings.every((string) => collectVariables(string).length > 0)
  ).toBe(true);
});

test('Collect variables names from string', () => {
  const pattern = '{{abc}}1';
  const count = 3;
  const input = pattern.repeat(count);
  const result = collectVariablesNames(input);
  expect(result.length).toBe(count);
  expect(result.every((value) => value === 'abc')).toBe(true);

  expect(
    validStrings.every((string) => collectVariablesNames(string).length > 0)
  ).toBe(true);
});

test('No collect variables names from string', () => {
  const pattern = '{abc}1';
  const count = 3;
  const input = pattern.repeat(count);
  const result = collectVariablesNames(input);
  expect(result.length).toBe(0);

  expect(
    badStrings.every((string) => collectVariablesNames(string).length === 0)
  ).toBe(true);
});

test('Check contain variables in input', () => {
  expect(
    badStrings.every(
      (variant) => isNotMissedVariables(variant, storageList).isValid
    )
  ).toBe(false);
  expect(
    validStrings.every(
      (variant) => isNotMissedVariables(variant, storageList).isValid
    )
  ).toBe(true);
});

test('No missing variables if storage contain name', () => {
  expect(
    badStrings.every(
      (variant) =>
        isNotMissedVariables(variant, storageList).notFoundVars.length === 0
    )
  ).toBe(true);
  expect(
    validStrings.every(
      (variant) =>
        isNotMissedVariables(variant, storageList).notFoundVars.length === 0
    )
  ).toBe(true);
});

test('Has missing variables if storage not contain name', () => {
  expect(
    validStrings.every(
      (variant) =>
        isNotMissedVariables(variant, storageList2).notFoundVars.length > 0
    )
  ).toBe(true);
});

test('Not found if empty list', () => {
  const list = {};
  const checked = isNotMissedVariables('{{pse}}', list);
  expect(checked.isValid).toBe(false);
  expect(checked.notFoundVars).toStrictEqual(['pse']);
});

test('Check syntax', () => {
  expect(badStrings.every((value) => isValidBrackets(value))).toBe(false);
  expect(validStrings.every((value) => isValidBrackets(value))).toBe(true);

  expect(
    badStrings.every(
      (variant) => isNotMissedVariables(variant, storageList2).isInvalidSyntax
    )
  ).toBe(true);
});

test('Replace variable name to value', () => {
  const testString = Object.keys(storageList)[0].repeat(3);
  const resultString = Object.values(storageList)[0].repeat(3);
  expect(ejectVariables(testString, storageList)).toBe(resultString);
});

test('Convert all variables in form data', () => {
  const name = Object.keys(storageList)[0];
  const value = Object.values(storageList)[0];
  const input = {
    method: 'GET',
    endpoint: `foo:${name}123${name}123`,
    header: [
      {
        name: '12321',
        value: `${name}`,
      },
    ],
    type: 'application/json',
    language: 'cURL',
    body: `${name}${name}${name}`,
  };
  const output = {
    method: 'GET',
    endpoint: `foo:${value}123${value}123`,
    header: [
      {
        name: '12321',
        value: `${value}`,
      },
    ],
    type: 'application/json',
    language: 'cURL',
    body: `${value}${value}${value}`,
  };
  expect(convertValues(input, storageList)).toStrictEqual(output);
});
