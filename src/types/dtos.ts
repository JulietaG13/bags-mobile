
export interface CreateWalletRequest {
  /** Email must not be blank and must be a valid email address */
  email: string;
  /** Password must be at least 8 characters long */
  password: string;
}

export interface AuthRequest {
  /** Email must not be blank and must be a valid email address */
  email: string;
  /** Password must not be blank */
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email must be a valid email address'
  },
  password: {
    register: {
      minLength: 8,
      message: 'Password must be at least 8 characters long'
    },
    login: {
      required: true,
      message: 'Password must not be blank'
    }
  }
} as const;

export const prepareCreateWalletRequest = (data: CreateWalletRequest): CreateWalletRequest => ({
  email: data.email?.trim() || '',
  password: data.password
});

export const isValidEmail = (email: string): boolean => {
  return ValidationRules.email.pattern.test(email.trim());
};

export const isValidPassword = (password: string, isRegistration: boolean = false): boolean => {
  if (isRegistration) {
    return password.length >= ValidationRules.password.register.minLength;
  }
  return password.length > 0;
}; 