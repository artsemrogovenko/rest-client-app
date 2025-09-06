import {
  type RouteConfig,
  // route,
  index,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('./routes/app-layout.tsx', [
    index('./routes/main-page.tsx'),

    // layout('./routes/auth/layout.tsx', [
    //   route('auth/signin', './routes/auth/signin.tsx'),
    //   route('auth/signup', './routes/auth/signup.tsx'),
    // ]),
  ]),
] satisfies RouteConfig;
