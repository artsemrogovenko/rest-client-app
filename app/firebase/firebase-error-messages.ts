import { useTranslation } from "react-i18next";

const useErrorMessage = () => {
  const { t } = useTranslation();
  return (code: string): string => {
    const key = `error.${code}`;
    const message = t(`error.${key}`);
    return message !== key ? message : t(`error.default`);
  }
};

export default useErrorMessage;
