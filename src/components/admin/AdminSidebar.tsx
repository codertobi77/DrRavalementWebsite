import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  link: string;
  category: 'content' | 'business' | 'system';
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  // Gestion de contenu
  {
    id: 'content-management',
    title: 'Gestion de contenu',
    icon: 'ri-edit-line',
    link: '/admin/content',
    category: 'content'
  },
  {
    id: 'articles',
    title: 'Articles',
    icon: 'ri-article-line',
    link: '/admin/articles',
    category: 'content'
  },
  
  // Système
  {
    id: 'config',
    title: 'Configuration',
    icon: 'ri-settings-line',
    link: '/admin/config',
    category: 'system'
  },
];

const categories = [
  { id: 'content', title: 'Contenu', icon: 'ri-edit-line' },
  { id: 'system', title: 'Système', icon: 'ri-settings-3-line' }
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  // Refs for focus management
  const sidebarRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const filteredItems = (category: string) => 
    sidebarItems.filter(item => item.category === category);

  // Écouter l'événement personnalisé pour ouvrir la sidebar
  useEffect(() => {
    const handleOpenSidebar = () => {
      // Store the currently focused element before opening
      previousActiveElement.current = document.activeElement as HTMLElement;
      setMobileOpen(true);
    };

    window.addEventListener('openSidebar', handleOpenSidebar);
    return () => {
      window.removeEventListener('openSidebar', handleOpenSidebar);
    };
  }, []);

  // Escape key handler and focus management for mobile sidebar
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    // Focus trap function
    const handleFocus = (event: FocusEvent) => {
      if (!sidebarRef.current?.contains(event.target as Node)) {
        // If focus escapes the sidebar, bring it back to the first focusable element
        const firstFocusable = sidebarRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);

    // Focus the first focusable element in the sidebar
    const firstFocusable = sidebarRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    firstFocusable?.focus();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [mobileOpen]);

  // Restore focus when mobile sidebar closes
  useEffect(() => {
    if (!mobileOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [mobileOpen]);

  // Notifier l'AdminLayout du changement d'état de collapse
  useEffect(() => {
    const event = new CustomEvent('sidebarCollapseChange', { 
      detail: { collapsed } 
    });
    window.dispatchEvent(event);
  }, [collapsed]);

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation mobile"
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          bg-white border-r border-gray-200 transition-all duration-300 z-50
          fixed inset-y-0 left-0 h-screen
          flex flex-col
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* En-tête */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Administration</h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">DR RAVALEMENT</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                title={collapsed ? 'Étendre' : 'Réduire'}
              >
                <i className={`ri-${collapsed ? 'menu-unfold' : 'menu-fold'}-line text-sm sm:text-base`}></i>
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                title="Fermer"
              >
                <i className="ri-close-line text-sm sm:text-base"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {categories.map((category) => (
            <div key={category.id}>
              {!collapsed && (
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <i className={`${category.icon} text-gray-400 text-sm`}></i>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category.title}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1">
                {filteredItems(category.id).map((item) => {
                  const isActive = location.pathname === item.link;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors group ${
                        isActive
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${
                        isActive ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <i className={`${item.icon} text-xs sm:text-sm`}></i>
                      </div>
                      
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Lien vers la page d'accueil en bas */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors group"
          >
            <div className="p-1 sm:p-1.5 rounded-lg flex-shrink-0 bg-gray-100 group-hover:bg-gray-200">
              <i className="ri-home-line text-xs sm:text-sm"></i>
            </div>
            {!collapsed && (
              <span className="flex-1 truncate">Page d'accueil</span>
            )}
          </Link>
        </div>
      </div>

    </>
  );
}
