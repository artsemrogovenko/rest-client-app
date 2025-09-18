import type { Language } from '~/server/code-generator/types';
import { SelectItem } from '~/components/ui/select';
import { Fragment } from 'react/jsx-runtime';

export default function ListMapper(languages: Language[]) {
  return (
    <Fragment key={'variants'}>
      {languages.map((language) =>
        language.variants.map((variant) => {
          return (
            <SelectItem
              value={`${language.key}&${variant.key}`}
              key={`${language.label}-${variant.key}`}
            >
              {`${language.label} ${variant.key}`}
            </SelectItem>
          );
        })
      )}
    </Fragment>
  );
}
