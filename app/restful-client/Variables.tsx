import { useForm } from 'react-hook-form';
import { Form } from '~/components/ui/form';
import DynamicList from '~/restful-client/DynamicList';

export default function Variables() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <DynamicList title="variable" />
      </form>
    </Form>
  );
}
