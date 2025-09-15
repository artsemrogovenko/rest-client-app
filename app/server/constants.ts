export const initLanguage = [
  {
    key: 'csharp',
    label: 'C#',
    syntax_mode: 'csharp',
    variants: [
      {
        key: 'HttpClient',
      },
      {
        key: 'RestSharp',
      },
    ],
  },
];

export const defaultLanguage = `${initLanguage[0].label}&${initLanguage[0].variants[0].key}`;
