'use server';
import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';
import { RESTFUL_CLIENT_PATH } from './routes/dashboard/restful-client/constants';

export default [
  layout('./routes/app-layout.tsx', [
    index('./routes/main-page.tsx'),

    layout('./routes/auth/auth-layout.tsx', [
      route('login', './routes/auth/sign-in.tsx'),
      route('register', './routes/auth/sign-up.tsx'),
    ]),

    layout('./routes/dashboard/dashboard-layout.tsx', [
      route('dashboard', 'routes/dashboard/dashboard.tsx'),
      route(
        `${RESTFUL_CLIENT_PATH}:method?/:encodedUrl?/:encodedData?`,
        'routes/dashboard/restful-client/RestfulClient.tsx'
      ),
      route('variables', 'routes/dashboard/variables/Variables.tsx'),
      route('api/request', 'server/request.ts'),
    ]),

    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
