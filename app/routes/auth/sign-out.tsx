import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { auth } from '~/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function SignOut() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <Button onClick={handleSignOut} className="cursor-pointer" size="sm">
      Sign Out
    </Button>
  );
}
