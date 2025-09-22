'use client';
import type { DynamicListProps } from './types';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { useTranslation } from 'react-i18next';

export default function DynamicList({ role, control }: DynamicListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: role,
    rules: {
      minLength: 1,
    },
  });
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-2 rounded-lg border md:-mx-1 p-5">
      <div className="flex items-center gap-2 justify-between">
        <h4 className="capitalize">{t(`${role}`)}</h4>
        <Button onClick={() => append({ name: '', value: '' })} type={'button'}>
          {t('add')}
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {fields.map((line, index) => (
          <li className="flex gap-2 items-end" key={line.id}>
            <FormField
              name={`${role}.${index}.name`}
              control={control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormMessage className="relative top-2 left-1" />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('name')}
                      id={`${role}-${index}-name`}
                      className=" w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name={`${role}.${index}.value`}
              control={control}
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormMessage className="relative top-2 left-1 " />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('value')}
                      id={`${role}-${index}-value`}
                      className=" w-full"
                    />
                  </FormControl>
                </FormItem>
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
