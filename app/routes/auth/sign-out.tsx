import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { auth } from '~/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import useLangNav from '~/hooks/langLink';

export default function SignOut() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { link } = useLangNav();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate(link('/'));
    } catch {
      toast.error('Failed to sign out. Please try again');
    }
  }

  return (
    <Button onClick={handleSignOut} className="cursor-pointer" size="sm">
      {t("signOut")}
    </Button>
  );
}
