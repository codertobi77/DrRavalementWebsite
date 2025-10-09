import { useState } from 'react';
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
    link: '/admin/content-management',
    category: 'content'
  },
  {
    id: 'pages',
    title: 'Pages du site',
    icon: 'ri-file-text-line',
    link: '/admin/pages',
    category: 'content'
  },
  {
    id: 'media',
    title: 'Médias',
    icon: 'ri-image-line',
    link: '/admin/media',
    category: 'content'
  },
  
  // Gestion métier
  {
    id: 'bookings',
    title: 'Réservations',
    icon: 'ri-calendar-line',
    link: '/admin/bookings',
    category: 'business',
    badge: 0
  },
  {
    id: 'projects',
    title: 'Projets',
    icon: 'ri-building-line',
    link: '/admin/projects',
    category: 'business'
  },
  {
    id: 'quotes',
    title: 'Devis',
    icon: 'ri-file-list-line',
    link: '/admin/quotes',
    category: 'business'
  },
  
  // Système
  {
    id: 'users',
    title: 'Utilisateurs',
    icon: 'ri-user-line',
    link: '/admin/users',
    category: 'system'
  },
  {
    id: 'config',
    title: 'Configuration',
    icon: 'ri-settings-line',
    link: '/admin/config',
    category: 'system'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: 'ri-bar-chart-line',
    link: '/admin/analytics',
    category: 'system'
  }
];

const categories = [
  { id: 'content', title: 'Contenu', icon: 'ri-edit-line' },
  { id: 'business', title: 'Métier', icon: 'ri-briefcase-line' },
  { id: 'system', title: 'Système', icon: 'ri-settings-3-line' }
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredItems = (category: string) => 
    sidebarItems.filter(item => item.category === category);

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Administration</h2>
              <p className="text-sm text-gray-500">DR RAVALEMENT</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`ri-${collapsed ? 'menu-unfold' : 'menu-fold'}-line`}></i>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-6">
        {categories.map((category) => (
          <div key={category.id}>
            {!collapsed && (
              <div className="flex items-center space-x-2 mb-3">
                <i className={`${category.icon} text-gray-400`}></i>
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
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-orange-200' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <i className={`${item.icon} text-sm`}></i>
                    </div>
                    
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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

      {/* Actions rapides */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Actions rapides
          </h3>
          <div className="space-y-2">
            <Link
              to="/admin/pages"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="ri-add-line"></i>
              <span>Nouvelle page</span>
            </Link>
            <Link
              to="/admin/content-management"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="ri-edit-line"></i>
              <span>Gestion de contenu</span>
            </Link>
            <Link
              to="/admin/bookings"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="ri-calendar-line"></i>
              <span>Voir réservations</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
