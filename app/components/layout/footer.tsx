const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-slate-700">
        <div className="flex items-center justify-center gap-3">
          <p className="font-bold">Developed by:</p>
          <a
            href="https://github.com/artsemrogovenko"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Artsem Rahavenka
          </a>
          <a
            href="https://github.com/vsv-noon"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Viacheslav Anisimov
          </a>
          <a
            href="https://github.com/christopher-0118"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Kristina Karantsevich
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
      </div>
    </footer>
  );
};

export default Footer;
