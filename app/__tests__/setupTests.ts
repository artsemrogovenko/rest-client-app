import '@testing-library/jest-dom';
import '@testing-library/user-event';

export const testFormData = {
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
