import type { Language } from '~/server/code-generator/types';
import { SelectItem } from '~/components/ui/select';

export default function ListMapper(languages: Language[]) {
  return languages.map((language) =>
    language.variants.map((variant) => {
      return (
        <SelectItem
          value={`${language.label}&${variant.key}`}
          key={`${language.label}-${variant.key}`}
        >
          {`${language.label} ${variant.key}`}
        </SelectItem>
      );
    })
  );
}
