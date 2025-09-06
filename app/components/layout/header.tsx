import { Link } from 'react-router';
import { Button } from '../ui/button';

const isAuthenticated = () => {

  /* тут по идее должна быть */
  const res = true;
  if (res) {
    return (
      <>
        <Button size="sm">
          <Link to="/login">Sign In</Link>
        </Button>
        <Button size="sm" variant="secondary">
          <Link to="/register">Sign Up</Link>
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button size="sm">
          <Link to="/"> Sign Out</Link>
        </Button>
      </>
    );
  }
};

const Header = () => {
  return (
    <header>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="h-10 w-10 bg-black flex items-center justify-center rounded-sm">
          <Link to="/" className="font-semibold text-white">
            H&H
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            EN/RU
          </Button>

          {isAuthenticated()}
        </div>
      </div>
    </header>
  );
};

export default Header;
