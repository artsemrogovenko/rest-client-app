import { Link } from 'react-router';
import { Button } from '~/components/ui/button';

const NotFound = () => {
  return (
    <div className="text-center space-y-10">
      <h1 className="text-3xl font-bold">404 Not Found</h1>

      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
