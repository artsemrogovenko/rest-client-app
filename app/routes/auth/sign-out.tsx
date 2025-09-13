import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { auth } from '~/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

export default function SignOut() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate('/');
    } catch {
      toast.error('Failed to sign out. Please try again');
    }
  }

  return (
    <Button onClick={handleSignOut} className="cursor-pointer" size="sm">
      Sign Out
    </Button>
  );
}
