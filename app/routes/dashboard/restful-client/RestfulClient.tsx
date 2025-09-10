'use client';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/Response';

export default function RestfulClient() {
  return (
    <section className="flex flex-col size-full overflow-y-scroll">
      <h2>Restful Client</h2>
      <div className="flex align-center size-full gap-2 items-stretch content-start justify-center p-10 ">
        <ClientForm />
        <ResponseComponent />
      </div>
    </section>
  );
}
