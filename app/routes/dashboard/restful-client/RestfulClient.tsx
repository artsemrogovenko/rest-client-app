'use client';
import { useTranslation } from 'react-i18next';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/Response';

export default function RestfulClient() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col size-full overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <h2>{t("restClient")}</h2>
      <div className="flex align-center size-full gap-5 items-stretch content-start justify-center">
        <ClientForm />
        <ResponseComponent />
      </div>
    </section>
  );
}
