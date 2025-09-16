export const initLanguage = [
  {
    key: 'curl',
    label: 'cURL',
    syntax_mode: 'powershell',
    variants: [{ key: 'cURL' }],
  },
];

export const defaultLanguage = `${initLanguage[0].label}&${initLanguage[0].variants[0].key}`;
