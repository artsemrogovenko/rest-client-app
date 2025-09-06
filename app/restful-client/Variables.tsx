import { useForm } from 'react-hook-form';
import { Form } from '~/components/ui/form';
import DynamicList from '~/restful-client/DynamicList';
import { Button } from '~/components/ui/button';
import { type TVariablesSchema } from '~/restful-client/validate';

export default function Variables() {
  const form = useForm<TVariablesSchema>({ mode: 'onSubmit' });

  return (
    <Form {...form}>
      <form>
        <DynamicList role="variable" values={[]} control={form.control} />
        <Button type="submit" className="uppercase">
          save
        </Button>
      </form>
    </Form>
  );
}
