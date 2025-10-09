import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from '../feature/Header';
import Footer from '../feature/Footer';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../lib/auth-context';
import { AdminRouteGuard } from './AuthGuard';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function AdminLayout({ 
  children, 
  title = "Administration",
  description = "Gérez votre site web",
  showHeader = true,
  showFooter = true
}: AdminLayoutProps) {
  return (
    <AdminRouteGuard>
      <AdminLayoutContent 
        children={children}
        title={title}
        description={description}
        showHeader={showHeader}
        showFooter={showFooter}
      />
    </AdminRouteGuard>
  );
}

function AdminLayoutContent({ 
  children, 
  title = "Administration",
  description = "Gérez votre site web",
  showHeader = true,
  showFooter = true
}: AdminLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Contenu principal */}
        <div className="flex-1">
          <div className="p-8">
            {/* En-tête de page */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                  <p className="text-gray-600">
                    {description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Informations utilisateur */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Connecté en tant que <span className="font-medium">{user?.name || user?.email}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Rôle: {user?.role} • Dernière connexion: {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  
                  {/* Avatar utilisateur */}
                  <div className="relative group">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || user.email}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <i className="ri-user-line text-orange-600"></i>
                      )}
                    </div>
                    
                    {/* Menu déroulant */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-orange-600 font-medium">{user?.role}</p>
                      </div>
                      
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <i className="ri-logout-box-line mr-2"></i>
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            {children}
          </div>
        </div>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}
