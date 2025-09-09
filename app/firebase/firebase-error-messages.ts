const getErrorMessage = (code: string): string => {
  switch(code) {
    case "auth/email-already-in-use":
      return "Этот email уже используется.";
    default:
      return "Не удалось создать аккаунт. Попробуйте позже.";
  }
}

export default getErrorMessage;