import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRequireAuth, useRequireRole, useRequirePermission } from '../../lib/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: string | string[];
  requirePermission?: string;
  fallbackPath?: string;
}

export default function AuthGuard({ 
  children, 
  requireRole, 
  requirePermission, 
  fallbackPath = '/admin/login' 
}: AuthGuardProps) {
  const location = useLocation();

  // Si un rôle spécifique est requis
  if (requireRole) {
    const { hasRole, isAuthenticated, isLoading, shouldRedirect } = useRequireRole(requireRole);
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (shouldRedirect) {
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
    
    if (!hasRole) {
      return <AccessDenied />;
    }
  }
  
  // Si une permission spécifique est requise
  else if (requirePermission) {
    const { hasPermission, isAuthenticated, isLoading, shouldRedirect } = useRequirePermission(requirePermission);
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (shouldRedirect) {
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
    
    if (!hasPermission) {
      return <AccessDenied />;
    }
  }
  
  // Authentification de base
  else {
    const { isAuthenticated, isLoading, shouldRedirect } = useRequireAuth();
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (shouldRedirect) {
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}

// Composant de chargement
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">Vérification de l'authentification...</p>
      </div>
    </div>
  );
}

// Composant d'accès refusé
function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Accès refusé
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant de protection pour les routes admin
export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireRole="admin">
      {children}
    </AuthGuard>
  );
}

// Composant de protection pour les éditeurs et admins
export function EditorRouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireRole={["admin", "editor"]}>
      {children}
    </AuthGuard>
  );
}

// Composant de protection pour les permissions spécifiques
export function PermissionGuard({ 
  permission, 
  children 
}: { 
  permission: string; 
  children: React.ReactNode 
}) {
  return (
    <AuthGuard requirePermission={permission}>
      {children}
    </AuthGuard>
  );
}
