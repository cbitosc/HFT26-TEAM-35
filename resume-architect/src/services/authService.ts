import { User, LoginCredentials, SignupCredentials } from '../types';

/**
 * =======================================================================
 * DEVELOPMENT NOTICE: TEMPORARY LOCAL DEVELOPMENT AUTHENTICATION ONLY
 * =======================================================================
 * This module provides temporary client-side session storage for local
 * frontend development and prototyping. It is NOT production-secure.
 *
 * ARCHITECTURAL DESIGN:
 * This service is strictly separated behind this interface so it can be
 * connected directly to:
 * 1. Python FastAPI endpoints (`POST /api/v1/auth/login`, `POST /api/v1/auth/register`)
 * 2. SQLite / PostgreSQL database user tables with hashed passwords (bcrypt/argon2)
 * 3. HTTP-only secure JWT cookies or authorization headers.
 * =======================================================================
 */

const STORAGE_KEY_USER = 'resume_architect_dev_user';
const STORAGE_KEY_TOKEN = 'resume_architect_dev_token';

export const authService = {
  /**
   * Temporary local authentication for development.
   * Simulates network latency and sets development user state.
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const name =
      credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
      'Candidate';

    const user: User = {
      id: 'dev_usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email: credentials.email,
      createdAt: new Date().toISOString(),
    };

    const token = 'dev_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user, token };
  },

  /**
   * Temporary local registration for development.
   */
  async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user: User = {
      id: 'dev_usr_' + Math.random().toString(36).substring(2, 9),
      name: credentials.name || 'Candidate',
      email: credentials.email,
      createdAt: new Date().toISOString(),
    };

    const token = 'dev_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return { user, token };
  },

  /**
   * Clears temporary session from local storage.
   */
  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },

  /**
   * Checks for an existing development session.
   */
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },
};
