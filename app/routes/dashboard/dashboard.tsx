import useAuth from '~/contexts/auth/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center justify-evenly min-h-60">
      <div>Welcome back, <span className='font-bold'>{user.email}</span>!</div>
    </div>
  );
}
