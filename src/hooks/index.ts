export { useAuth } from './useAuth';

export type { 
  CreateWalletRequest, 
  AuthRequest, 
  AuthResponse 
} from '../types/dtos';

export { default as useAuthDefault } from './useAuth';

export { API_CONFIG, getBaseUrl } from '../config/api';

export { 
  ValidationRules, 
  prepareCreateWalletRequest,
  isValidEmail,
  isValidPassword 
} from '../types/dtos'; 