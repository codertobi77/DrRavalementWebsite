import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Types pour l'authentification
export interface AuthUser {
  _id: Id<"users">;
  email: string;
  name?: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending";
  last_login?: string;
  avatar?: string;
}

export interface AuthSession {
  _id: Id<"auth_sessions">;
  user_id: Id<"users">;
  token: string;
  expires_at: string;
  created_at: string;
  last_used: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider du contexte d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le token depuis le localStorage
  const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  };

  // Sauvegarder le token dans le localStorage
  const setStoredToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  };

  // Supprimer le token du localStorage
  const removeStoredToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  };

  // Récupérer les informations de session depuis Convex
  const storedToken = getStoredToken();
  const sessionData = useQuery(
    api.auth.validateSession,
    storedToken ? { token: storedToken } : "skip"
  );

  // Mutations et actions
  const loginAction = useMutation(api["auth-actions"].authenticateUser);
  const logoutMutation = useMutation(api.auth.logout);

  // Effet pour gérer les données de session
  useEffect(() => {
    if (sessionData === undefined) {
      // En cours de chargement
      setIsLoading(true);
    } else if (sessionData === null) {
      // Session invalide ou expirée
      setUser(null);
      setSession(null);
      setIsLoading(false);
      removeStoredToken();
    } else {
      // Session valide
      setUser(sessionData.user);
      setSession(sessionData.session);
      setIsLoading(false);
    }
  }, [sessionData]);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Récupérer les informations du navigateur
      const ip_address = await getClientIP();
      const user_agent = navigator.userAgent;

      const result = await loginAction({
        email,
        password,
        ip_address,
        user_agent
      });

      // Sauvegarder le token
      setStoredToken(result.session.token);
      
      // Mettre à jour l'état
      setUser(result.user);
      setSession(result.session);

      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await logoutMutation({ token });
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      setUser(null);
      setSession(null);
      removeStoredToken();
    }
  };

  // Fonction pour rafraîchir la session
  const refreshSession = async () => {
    const token = getStoredToken();
    if (token) {
      // La session sera automatiquement rafraîchie par useQuery
      // Pas besoin de faire quoi que ce soit ici
    }
  };

  // Fonction pour vérifier les rôles
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Fonction pour vérifier les permissions
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Définir les permissions par rôle
    const permissions: Record<string, string[]> = {
      admin: [
        'users.read', 'users.write', 'users.delete',
        'config.read', 'config.write',
        'bookings.read', 'bookings.write', 'bookings.delete',
        'projects.read', 'projects.write', 'projects.delete',
        'quotes.read', 'quotes.write', 'quotes.delete',
        'cms.read', 'cms.write', 'cms.delete',
        'analytics.read'
      ],
      editor: [
        'config.read', 'config.write',
        'bookings.read', 'bookings.write',
        'projects.read', 'projects.write',
        'quotes.read', 'quotes.write',
        'cms.read', 'cms.write'
      ],
      viewer: [
        'config.read',
        'bookings.read',
        'projects.read',
        'quotes.read',
        'cms.read',
        'analytics.read'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Fonction pour obtenir l'IP du client (simplifiée)
  const getClientIP = async (): Promise<string> => {
    try {
      // Utiliser un service externe pour obtenir l'IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    logout,
    refreshSession,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour vérifier l'authentification
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated
  };
}

// Hook pour vérifier les rôles
export function useRequireRole(role: string | string[]) {
  const { hasRole, isAuthenticated, isLoading } = useAuth();
  
  return {
    hasRole: hasRole(role),
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && (!isAuthenticated || !hasRole(role))
  };
}

// Hook pour vérifier les permissions
export function useRequirePermission(permission: string) {
  const { hasPermission, isAuthenticated, isLoading } = useAuth();
  
  return {
    hasPermission: hasPermission(permission),
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && (!isAuthenticated || !hasPermission(permission))
  };
}
