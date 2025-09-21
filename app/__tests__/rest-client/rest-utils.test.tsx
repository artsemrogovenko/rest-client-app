import { expect, test } from 'vitest';
import convertFormToUrl, {
  collectVariables,
  collectVariablesNames,
  convertValues,
  ejectVariables,
  findValue,
  fromBase64,
  isNotMissedVariables,
  isValidBrackets,
  inlineJson,
  toBase64,
  decodeKeysAndValues,
  convertUrlToForm,
} from '~/routes/dashboard/restful-client/utils';
import { HEADER_BODY_TYPE } from '~/routes/dashboard/restful-client/constants';

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

describe('Tests decode & encode base64', () => {
  test('Encode', () => {
    const testString = 'http://localhost:5173/client';
    const encoded = toBase64(testString);
    expect(encoded).not.toBe(testString);
    expect(encoded.length).greaterThan(0);
  });

  test('Decoded result equivalent input', () => {
    const testString = 'http://localhost:5173/client';
    const encoded = toBase64(testString);
    expect(encoded).not.toBe(testString);
    expect(fromBase64(encoded)).toBe(testString);
  });
});

describe('body json prepare test', () => {
  test('inline json', () => {
    const input =
      '{\n  "browsers": {\n    "firefox": {\n      "name": "Firefox",\n      "pref_url": "about:config",\n      "releases": {\n        "1": {\n          "release_date": "2004-11-09",\n          "status": "retired",\n          "engine": "Gecko",\n          "engine_version": "1.7"\n        }\n      }\n    }\n  }\n}';
    const output =
      '{"browsers":{"firefox":{"name":"Firefox","pref_url":"about:config","releases":{"1":{"release_date":"2004-11-09","status":"retired","engine":"Gecko","engine_version":"1.7"}}}}}';
    expect(inlineJson(input)).toBe(output);
  });

  test('no delete format in values', () => {
    const input =
      '{        "release_date": "2004-11-09 \\t beta",\n        "status": "required, \\n new line"      }';
    const output =
      '{"release_date":"2004-11-09 \\t beta","status":"required, \\n new line"}';
    expect(inlineJson(input)).toBe(output);
  });

  test('throw error if empty or not string', () => {
    const input1 = '';
    const input2 = undefined;
    expect(() => inlineJson(input1)).toThrowError('String is empty');
    expect(() => inlineJson(input2)).toThrowError('String is empty');
  });
});

describe('replace local environments in object', () => {
  const variables = {
    '{{ggg}}': '12',
    '{{45646}}': 'name',
    '{{u}}': 'uku',
  };

  test('replace on inner array', () => {
    const input = {
      '{{45646}}': 'Molecule Man',
      age: '{{ggg}}',
      powers: [
        'Radiation{{ggg}} resist{{u}}ance',
        ['Turning', ['{{ggg}}']],
        'Radiation blast',
      ],
    };
    const output = {
      age: '12',
      name: 'Molecule Man',
      powers: [
        'Radiation12 resistukuance',
        ['Turning', ['12']],
        'Radiation blast',
      ],
    };
    expect(decodeKeysAndValues(input, variables)).toStrictEqual(output);
  });
  test('replace on inner object', () => {
    const input = {
      '{{45646}}': 'Molecule Man',
      age: '{{ggg}}',
      powers: {
        'Radiation{{ggg}}': 'resist{{u}}ance',
        Turning: 'tiny',
        Radiation: { '{{ggg}}': 'abc' },
      },
    };
    const output = {
      age: '12',
      name: 'Molecule Man',
      powers: {
        Radiation12: 'resistukuance',
        Turning: 'tiny',
        Radiation: {
          '12': 'abc',
        },
      },
    };
    expect(decodeKeysAndValues(input, variables)).toStrictEqual(output);
  });
});

describe('Cross reverse tests', () => {
  const formObject = {
    body: 'hello world',
    endpoint: 'https://memi.klev.club/uploads/',
    header: [
      {
        name: 'sample',
        value: 'value',
      },
      {
        name: 'header2',
        value: 'value2',
      },
    ],
    method: 'POST',
    type: 'text/plain; charset=utf-8',
  };
  const searchParams = new URLSearchParams();
  beforeAll(() => {
    formObject.header.forEach((header) =>
      searchParams.set(toBase64(header.name), toBase64(header.value))
    );
    searchParams.set(toBase64(HEADER_BODY_TYPE), toBase64(formObject.type));
  });

  test('Cross transform form-> url-> form', () => {
    const encodedUrl = convertFormToUrl(formObject);

    const decodedObject = convertUrlToForm(
      formObject.method,
      toBase64(formObject.endpoint),
      toBase64(formObject.body),
      searchParams
    );

    expect(encodedUrl).toBeTypeOf('string');
    expect(decodedObject).toBeTypeOf('object');
    expect(decodedObject).toEqual(formObject);
  });
});

test('no encode base64 if empty string', () => {
  expect(fromBase64('')).toBe('');
});
