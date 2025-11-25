import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    // If token is malformed, consider it expired
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
};

export const getTokenExpirationTime = (token: string | null): number | null => {
  if (!token) return null;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

export const getTimeUntilExpiration = (token: string | null): number | null => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return null;

  return expirationTime - Date.now();
};