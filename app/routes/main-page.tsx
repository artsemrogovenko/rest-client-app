import { useContext } from "react";
import AuthContext from "~/contexts/auth/AuthContext";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import Dashboard from "./dashboard/dashboard";

const MainPage = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user } = auth;

  return (
    <>
      <div className="flex flex-col items-center gap-8 w-[90%] max-w-xl flex-1 text-center">
        {!user ? (
          <>
            <h1 className="text-center font-bold text-3xl">Welcome!</h1>
            <div className="flex gap-4">
              <Button asChild><Link to="/login">Sign In</Link></Button>
              <Button asChild><Link to="/register">Sign Up</Link></Button>
            </div>
          </>
        ) : (
          <>
            <Dashboard />
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline"><Link to="/dashboard">REST Client</Link></Button>
              <Button asChild variant="outline"><Link to="/history">History</Link></Button>
              <Button asChild variant="outline"><Link to="/variables">Variables</Link></Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MainPage;
