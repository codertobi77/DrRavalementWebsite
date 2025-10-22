import { type ReactNode, useState, useEffect, useRef } from 'react';
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
  showHeader = false,
  showFooter = false
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
  showHeader = false,
  showFooter = false
}: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  // Écouter l'événement de changement de collapse de la sidebar
  useEffect(() => {
    const handleSidebarCollapseChange = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarCollapseChange', handleSidebarCollapseChange as EventListener);
    return () => {
      window.removeEventListener('sidebarCollapseChange', handleSidebarCollapseChange as EventListener);
    };
  }, []);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Keyboard event handlers
  const handleAvatarKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setDropdownOpen(!dropdownOpen);
    } else if (event.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDropdownOpen(false);
      avatarButtonRef.current?.focus();
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Focus management when dropdown opens
  useEffect(() => {
    if (dropdownOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Contenu principal avec marge pour la sidebar fixe */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Lien pour ouvrir la sidebar sur mobile */}
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => {
                const event = new CustomEvent('openSidebar');
                window.dispatchEvent(event);
              }}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              <i className="ri-menu-line"></i>
              <span>Ouvrir le sidebar</span>
            </button>
          </div>
            {/* En-tête de page */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
                    {title}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {description}
                  </p>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                  {/* Informations utilisateur */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500 truncate max-w-48">
                      Connecté en tant que <span className="font-medium">{user?.name || user?.email}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Rôle: {user?.role} • Dernière connexion: {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  
                  {/* Avatar utilisateur */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      ref={avatarButtonRef}
                      onClick={toggleDropdown}
                      onKeyDown={handleAvatarKeyDown}
                      aria-haspopup="menu"
                      aria-expanded={dropdownOpen}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                    >
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || user.email}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <i className="ri-user-line text-orange-600 text-sm sm:text-base"></i>
                      )}
                    </button>
                    
                    {/* Menu déroulant */}
                    {dropdownOpen && (
                      <div 
                        role="menu"
                        onKeyDown={handleMenuKeyDown}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Utilisateur'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <p className="text-xs text-orange-600 font-medium">{user?.role}</p>
                        </div>
                        
                        <button
                          ref={firstMenuItemRef}
                          onClick={logout}
                          role="menuitem"
                          tabIndex={-1}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center"
                        >
                          <i className="ri-logout-box-line mr-2"></i>
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          {/* Contenu */}
          {children}
        </div>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}
