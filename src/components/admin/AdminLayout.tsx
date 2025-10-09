import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from '../feature/Header';
import Footer from '../feature/Footer';
import AdminSidebar from './AdminSidebar';

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
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Dernière connexion</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-orange-600"></i>
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
