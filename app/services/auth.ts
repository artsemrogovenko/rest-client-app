import { auth } from '~/firebase/firebaseConfig';

export const isAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resolve(!!user);
      unsubscribe();
    });
  });
};
