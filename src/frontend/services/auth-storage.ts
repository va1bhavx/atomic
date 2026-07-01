import { isElectron } from "../utils/isElectron";

declare global {
  interface Window {
    electronAPI?: {
      saveToken: (token: string) => Promise<boolean>;
      getToken: () => Promise<string | null>;
      deleteToken: () => Promise<boolean>;
    };
  }
}

const SESSION_TOKEN_KEY = "atomic_session_token";

export const authStorage = {
  async saveToken(token: string): Promise<boolean> {
    if (isElectron() && window.electronAPI) {
      return await window.electronAPI.saveToken(token);
    } else {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      return true;
    }
  },

  async getToken(): Promise<string | null> {
    if (isElectron() && window.electronAPI) {
      return await window.electronAPI.getToken();
    } else {
      return sessionStorage.getItem(SESSION_TOKEN_KEY);
    }
  },

  async deleteToken(): Promise<boolean> {
    if (isElectron() && window.electronAPI) {
      return await window.electronAPI.deleteToken();
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      return true;
    }
  },
};
