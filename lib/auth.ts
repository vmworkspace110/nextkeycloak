import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'master',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'web-client',
};

let keycloakInstance: Keycloak | null = null;

export const initKeycloak = async (): Promise<Keycloak | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!keycloakInstance) {
      keycloakInstance = new Keycloak(keycloakConfig);
      await keycloakInstance.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      });
    }
    return keycloakInstance;
  } catch (error) {
    console.error('Keycloak initialization failed:', error);
    return null;
  }
};

export const login = async (): Promise<Keycloak | null> => {
  try {
    const kc = await initKeycloak();
    if (kc && !kc.authenticated) {
      await kc.login({
        redirectUri: window.location.origin + '/dashboard',
      });
    }
    return kc;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const kc = await initKeycloak();
    if (kc) {
      await kc.logout({
        redirectUri: window.location.origin,
      });
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const getToken = async (): Promise<string | undefined> => {
  try {
    const kc = await initKeycloak();
    return kc?.token;
  } catch (error) {
    console.error('Failed to get token:', error);
    return undefined;
  }
};

export const updateToken = async (minValidity: number = 5): Promise<boolean> => {
  try {
    const kc = await initKeycloak();
    if (kc) {
      return await kc.updateToken(minValidity);
    }
    return false;
  } catch (error) {
    console.error('Token update failed:', error);
    return false;
  }
};

export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const kc = await initKeycloak();
    return kc?.hasRealmRole(role) ?? false;
  } catch (error) {
    console.error('Role check failed:', error);
    return false;
  }
};