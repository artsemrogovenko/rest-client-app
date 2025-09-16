import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="flex items-center justify-center gap-3">
        <p className="font-bold">{t('developed')}</p>
        <a
          href="https://github.com/artsemrogovenko"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          {t('artsemrogovenko')}
        </a>
        <a
          href="https://github.com/vsv-noon"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          {t('vsv-noon')}
        </a>
        <a
          href="https://github.com/christopher-0118"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          {t('christopher-0118')}
        </a>
      </div>
      <p>2025</p>
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://raw.githubusercontent.com/rolling-scopes-school/tasks/d5a5a7e203895c61d3abfbaf504abafa544f479e/react/assets/rss-logo.svg"
          alt="RS School Logo"
          className="h-10"
        />
      </a>
    </footer>
  );
};

export default Footer;
