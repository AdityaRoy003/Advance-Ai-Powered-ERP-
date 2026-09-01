export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: unknown;
  tokens: TokenPair;
}
