import {
  type RouteConfig,
  route,
  index,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('./routes/app-layout.tsx', [
    index('./routes/main-page.tsx'),

    layout('./routes/auth/auth-layout.tsx', [
      route('login', './routes/auth/sign-in.tsx'),
      route('register', './routes/auth/sign-up.tsx'),
    ]),

    layout('./routes/dashboard/dashboard-layout.tsx', [
      route('dashboard', 'routes/dashboard/dashboard.tsx'),
      // route('rest-client', 'routes/dashboard/rest-client.tsx'),
      // route('history', 'routes/dashboard/history.tsx'),
      // route('variables', 'routes/dashboard/variables.tsx')
    ]),

    route('*', './routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
