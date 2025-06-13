export const validateUserEmail = (email) =>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export const validateRecuriterEmail = (email) => {
    const emailRegex = /^[\w.%+-]+@(?![^@]*gmail\.)[\w.-]+\.[A-Za-z]{2,}$/i;
    return emailRegex.test(email);
}

export const checkPasswordCriteria = (password) => {
  return {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z\d]/.test(password),
    isMinLength: password.length >= 6,
  };
};

export const validateUrl = (url) => {
    const urlRegex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlRegex.test(url);
}







