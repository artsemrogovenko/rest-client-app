import {
  initializeApp,
  getApps,
  cert,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const getFirebaseConfig = () => {
  const privateKey = import.meta.env.VITE_FIREBASE_ADMIN?.replace(
    /\\n/g,
    '\n'
  )?.replace(/^"|"$/g, '');

  if (!privateKey) {
    throw new Error('Firebase admin private key is missing in env');
  }

  return {
    type: 'service_account',
    project_id: 'rest-client-app-bfa45',
    private_key_id: import.meta.env.VITE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: import.meta.env.VITE_CLIENT_EMAIL,
    client_id: import.meta.env.VITE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: import.meta.env.VITE_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com',
  };
};

const serviceAccount = getFirebaseConfig() as ServiceAccount;

let app: App;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0]!;
}

export const db = getFirestore(app);
