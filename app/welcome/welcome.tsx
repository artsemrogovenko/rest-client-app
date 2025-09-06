import { RestfulClient } from '~/restful-client/restful-client';
import ResponseComponent from '~/restful-client/Response';

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 h-full">
      <RestfulClient />
      <ResponseComponent />
    </main>
  );
}
