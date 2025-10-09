import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
  category: 'content' | 'business' | 'system';
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  // Gestion de contenu
  {
    id: 'content',
    title: 'Gestion de contenu',
    description: 'Gérer le contenu modifiable du site',
    icon: 'ri-edit-line',
    color: 'bg-indigo-500',
    link: '/admin/content',
    category: 'content'
  },
  
  // Gestion métier
  {
    id: 'bookings',
    title: 'Réservations',
    description: 'Gérer les rendez-vous clients',
    icon: 'ri-calendar-line',
    color: 'bg-green-500',
    link: '/admin/bookings',
    category: 'business',
    badge: 0
  },
  {
    id: 'projects',
    title: 'Projets',
    description: 'Suivre les chantiers en cours',
    icon: 'ri-building-line',
    color: 'bg-purple-500',
    link: '/admin/projects',
    category: 'business'
  },
  {
    id: 'quotes',
    title: 'Devis',
    description: 'Créer et suivre les devis',
    icon: 'ri-file-list-line',
    color: 'bg-yellow-500',
    link: '/admin/quotes',
    category: 'business'
  },
  
  // Système
  {
    id: 'users',
    title: 'Utilisateurs',
    description: 'Gérer les accès et permissions',
    icon: 'ri-user-line',
    color: 'bg-red-500',
    link: '/admin/users',
    category: 'system'
  },
  {
    id: 'config',
    title: 'Configuration',
    description: 'Paramètres généraux du site',
    icon: 'ri-settings-line',
    color: 'bg-gray-500',
    link: '/admin/config',
    category: 'system'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Statistiques et rapports',
    icon: 'ri-bar-chart-line',
    color: 'bg-teal-500',
    link: '/admin/analytics',
    category: 'system'
  }
];

const categories = [
  { id: 'content', title: 'Gestion de contenu', icon: 'ri-edit-line' },
  { id: 'business', title: 'Gestion métier', icon: 'ri-briefcase-line' },
  { id: 'system', title: 'Système', icon: 'ri-settings-3-line' }
];

export default function AdminNavigation() {
  const [activeCategory, setActiveCategory] = useState<'content' | 'business' | 'system'>('content');
  const location = useLocation();

  const filteredItems = navigationItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tableau de bord
        </h2>
        <p className="text-gray-600">
          Gérez votre site web et vos activités
        </p>
      </div>

      {/* Navigation par catégories */}
      <div className="p-6">
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.title}
            </button>
          ))}
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.link;
            
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`group relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  isActive
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Indicateur d'état actif */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Actions rapides
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/pages"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors"
          >
            <i className="ri-add-line mr-1"></i>
            Nouvelle page
          </Link>
          <Link
            to="/admin/content-management"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <i className="ri-edit-line mr-1"></i>
            Gestion de contenu
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
          >
            <i className="ri-calendar-line mr-1"></i>
            Voir réservations
          </Link>
        </div>
      </div>
    </div>
  );
}
