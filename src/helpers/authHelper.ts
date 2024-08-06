// src/helpers/authHelper.ts
import { jwtDecode } from "jwt-decode";
import { setToken } from '../services/api';

const TOKEN_KEY = 'token';

interface DecodedToken {
  username: string;
  exp: number;
  iat: number;
}

export const login = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  setToken(token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  setToken('');
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): { username: string } | null => {
  const token = getToken();
  if (token) {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    return { username: decoded.username };
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    logout();
    return false;
  }
};
