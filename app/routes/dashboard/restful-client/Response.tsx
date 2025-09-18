import { useTranslation } from "react-i18next";

export default function ResponseComponent() {
  const { t } = useTranslation();
  return (
    <aside className="flex flex-col gap-2 rounded-lg border min-w-[450px] w-1/2 flex-1 p-5 ">
      <h3>{t("rest-client-p.response")}</h3>
      <div className="flex flex-col gap-2 rounded-lg border p-2 h-full">
        <span className="rounded-lg border p-2">{t("rest-client-p.status")} </span>
        <h4>{t("rest-client-p.body-response")}</h4>
        <p className="break-all"></p>
      </div>
    </aside>
  );
}
