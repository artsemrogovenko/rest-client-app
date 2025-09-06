import { RestfulClient } from '~/restful-client/restful-client';
import ResponseComponent from '~/restful-client/Response';
import Variables from '~/restful-client/Variables';

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 h-full">
      <RestfulClient />
      <ResponseComponent />
      <Variables />
    </main>
  );
}
