import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from '@react-router/dev/routes';

export default [
  route('', './routes/root-redirect.tsx'),
  ...prefix(':lang', [
    layout('./routes/app-layout.tsx', [
      index('./routes/main-page.tsx'),

      layout('./routes/auth/auth-layout.tsx', [
        route('auth/login', './routes/auth/sign-in.tsx'),
        route('auth/register', './routes/auth/sign-up.tsx'),
      ]),

      layout('./routes/dashboard/dashboard-layout.tsx', [
        route('dashboard', 'routes/dashboard/dashboard.tsx'),
        route('client', 'routes/dashboard/restful-client/RestfulClient.tsx'),
        route('variables', 'routes/dashboard/variables/Variables.tsx'),
      ]),

      route('*', 'routes/not-found.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
