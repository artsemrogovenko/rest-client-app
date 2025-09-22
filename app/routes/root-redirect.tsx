import { redirect } from 'react-router';
import { DEFAULT_LOCALE } from '~/i18n/config';

export async function loader({ request }: { request: Request }) {
  const u = new URL(request.url);
  const { pathname, search, hash } = u;

  if (pathname.startsWith('/en') || pathname.startsWith('/ru')) return null;
  return redirect(`/${DEFAULT_LOCALE}${pathname}${search}${hash}`);
}

export default function RootRedirect() {
  return null;
}
