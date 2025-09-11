import { Link } from 'react-router';
import { Button } from '../ui/button';
import useAuth from '~/contexts/auth/useAuth';
import SignOut from '~/routes/auth/sign-out';
import { useEffect, useState } from 'react';
import { SCROLL_THRESHOLD, EVENT_SCROLL } from './constant';

const Header = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    window.addEventListener(EVENT_SCROLL, onScroll);
    return () => window.removeEventListener(EVENT_SCROLL, onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="h-10 w-10 bg-black bg-col flex items-center justify-center rounded-sm">
        <Link to="/" className="font-semibold text-white">
          H&H
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="cursor-pointer" size="sm">
          EN/RU
        </Button>
        {!user && (
          <>
            <Button size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm">
              <Link to="/register">Sign Up</Link>
            </Button>
          </>
        )}
        {user && (
          <>
            <Button size="sm">
              <Link to="/">Main Page</Link>
            </Button>
            <SignOut />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
