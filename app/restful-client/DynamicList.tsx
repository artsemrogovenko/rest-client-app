import { useState } from 'react';
import type { PairFields } from '~/restful-client/types';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { X } from 'lucide-react';

export default function DynamicList({ title }: { title: string }) {
  const [pairFields, setPairFields] = useState<PairFields[]>([]);

  const addPair = () => {
    setPairFields((prev) => [...prev, { name: '', value: '' }]);
  };

  const updatePair = (
    index: number,
    field: keyof PairFields,
    value: string
  ) => {
    setPairFields((prev) =>
      prev.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      )
    );
  };

  const deletePair = (index: number) => {
    setPairFields([...pairFields].filter((line, pos) => pos !== index));
  };
  return (
    <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
      <div className="flex items-center gap-2 justify-between">
        <h4 className="capitalize">{`${title}s`}</h4>
        <Button onClick={addPair}>Add {title}</Button>
      </div>

      <ul className="flex flex-col w-[320px] gap-2">
        {pairFields.map((line, index) => (
          <li className="flex gap-2" key={index}>
            <Input
              value={line.name}
              onChange={(e) => updatePair(index, 'name', e.target.value)}
              placeholder="name"
            />
            <Input
              value={line.value}
              onChange={(e) => updatePair(index, 'value', e.target.value)}
              placeholder="value"
            />
            <Button
              variant="secondary"
              size="icon"
              className="size-8"
              onClick={() => deletePair(index)}
            >
              <X color="red" />
            </Button>
          </li>
        ))}
      </ul>
    </article>
  );
}
