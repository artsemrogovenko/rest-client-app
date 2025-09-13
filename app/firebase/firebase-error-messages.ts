const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    default:
      return 'Failed to create account. Try again later.';
  }
};

export default getErrorMessage;
