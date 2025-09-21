import {
  initializeApp,
  getApps,
  cert,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountJson from '~/firebase/serviceAccountKey.json';

const serviceAccount = serviceAccountJson as ServiceAccount;

let app: App;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0]!;
}

export const db = getFirestore(app);
