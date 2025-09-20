import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';
import { RESTFUL_CLIENT_PATH } from './routes/dashboard/restful-client/constants';

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
        route(
          `${RESTFUL_CLIENT_PATH}:method?/:encodedUrl?/:encodedData?`,
          'routes/dashboard/restful-client/RestfulClient.tsx'
        ),
        route('/variables', 'routes/dashboard/variables/Variables.tsx'),
        route('api/request', 'server/request.ts'),
        route('api/code', 'server/code-generator/generator.ts'),
        route('history', 'routes/dashboard/history/History.tsx'),
      ]),

      route('*', 'routes/not-found.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
