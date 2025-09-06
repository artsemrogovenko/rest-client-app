import type { DynamicListProps } from '~/restful-client/types';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { X } from 'lucide-react';
import { Controller, useFieldArray } from 'react-hook-form';

export default function DynamicList({ role, control }: DynamicListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: role,
    rules: {
      minLength: 1,
    },
  });

  return (
    <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
      <div className="flex items-center gap-2 justify-between">
        <h4 className="capitalize">{`${role}s`}</h4>
        <Button onClick={() => append({ name: '', value: '' })} type={'button'}>
          Add {role}
        </Button>
      </div>

      <ul className="flex flex-col w-[320px] gap-2">
        {fields.map((line, index) => (
          <li className="flex gap-2" key={line.id}>
            <Controller
              name={`${role}.${index}.name`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="name"
                  id={`${role}-${index}-name`}
                />
              )}
            />
            <Controller
              name={`${role}.${index}.value`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="value"
                  id={`${role}-${index}-value`}
                />
              )}
            />
            <Button
              variant="secondary"
              size="icon"
              className="size-8"
              onClick={() => remove(index)}
              type="button"
            >
              <X color="red" />
            </Button>
          </li>
        ))}
      </ul>
    </article>
  );
}
