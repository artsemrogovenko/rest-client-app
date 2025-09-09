import { Link } from 'react-router';
import { Button } from '~/components/ui/button';

const MainPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center gap-16">
      <div className="m-auto max-w-[300px] w-full space-y-6 px-4">
        <h1 className="text-center font-bold text-3xl">Welcome!</h1>
        <div className="flex justify-center items-center gap-10 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <Button>
            <Link to={'/login'}>Sign In</Link>
          </Button>
          <Button>
            <Link to={'/register'}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
