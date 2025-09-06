import { Link } from 'react-router';
import { Button } from '../ui/button';
import useAuth from '~/contexts/auth/useAuth';
import SignOut from '~/routes/auth/sign-out';

const Header = () => {
  const { user } = useAuth();
  return (
    <header>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="h-10 w-10 bg-black flex items-center justify-center rounded-sm">
          <Link to="/" className="font-semibold text-white">
            H&H
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className='cursor-pointer' size="sm">
            EN/RU
          </Button>
          {!user ? (
            <>
              <Button size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <SignOut />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
