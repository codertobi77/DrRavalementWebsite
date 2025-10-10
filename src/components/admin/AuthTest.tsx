import React from 'react';
import { useAuth } from '../../lib/auth-context';

export default function AuthTest() {
  const { user, session, isLoading, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login('admin@dr-ravalement.fr', 'admin123');
    console.log('Login result:', result);
  };

  const handleLogout = async () => {
    await logout();
    console.log('Logged out');
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test d'Authentification</h2>
      
      <div className="space-y-4">
        <div>
          <strong>État de chargement:</strong> {isLoading ? 'Oui' : 'Non'}
        </div>
        
        <div>
          <strong>Authentifié:</strong> {isAuthenticated ? 'Oui' : 'Non'}
        </div>
        
        <div>
          <strong>Utilisateur:</strong> {user ? user.email : 'Aucun'}
        </div>
        
        <div>
          <strong>Rôle:</strong> {user ? user.role : 'Aucun'}
        </div>
        
        <div>
          <strong>Token:</strong> {session ? session.token.substring(0, 20) + '...' : 'Aucun'}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Se connecter
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
