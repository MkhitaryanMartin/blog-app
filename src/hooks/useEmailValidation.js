import { useState } from 'react';

const useEmailValidation = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email is required');
    } else if (email.trim() !== email) {
      setEmailError('Email cannot start or end with spaces');
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return {
    email,
    setEmail,
    emailError,
    handleChange,
    validateEmail
  };
};

export default useEmailValidation;
