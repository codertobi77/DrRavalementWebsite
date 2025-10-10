
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import Button from '../base/Button';
import ContactInfoSection from '../cms/ContactInfoSection';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-orange-600 text-white py-2">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <ContactInfoSection variant="header" />
            <div className="hidden md:block text-xs lg:text-sm">
              <span>Ravalement • Maçonnerie • Couverture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo intégré */}
          <a href="/" className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">DR</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">DR RAVALEMENT</h1>
              <p className="text-xs sm:text-sm text-orange-600 font-medium">Expert Façades & Maçonnerie</p>
            </div>
          </a>

          {/* Navigation desktop */}
          <nav className="hidden xl:flex items-center space-x-6">
            <a 
              href="/" 
              className={`font-medium transition-colors duration-200 text-sm pb-1 ${
                isActiveLink('/') 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Accueil
            </a>
            <a 
              href="/about" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/about') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              À Propos
            </a>
            <a 
              href="/services" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/services') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Services
            </a>
            <a 
              href="/portfolio" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/portfolio') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Réalisations
            </a>
            <a 
              href="/booking" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/booking') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Rendez-vous
            </a>
            <a 
              href="/client-dashboard" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/client-dashboard') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Espace Client
            </a>
            <a 
              href="/contact" 
              className={`font-medium transition-colors duration-200 text-sm ${
                isActiveLink('/contact') 
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Contact
            </a>
            {isAuthenticated && user?.role === 'admin' && (
              <a 
                href="/admin" 
                className={`font-medium transition-colors duration-200 text-sm ${
                  isActiveLink('/admin') 
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <i className="ri-settings-3-line mr-1"></i>
                Admin
              </a>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Button href="/contact" className="text-sm px-4 py-2">
              Devis Gratuit
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl sm:text-2xl`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Accueil
              </a>
              <a 
                href="/about" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/about') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                À Propos
              </a>
              <a 
                href="/services" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/services') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Services
              </a>
              <a 
                href="/portfolio" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/portfolio') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Réalisations
              </a>
              <a 
                href="/booking" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/booking') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Rendez-vous
              </a>
              <a 
                href="/client-dashboard" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/client-dashboard') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Espace Client
              </a>
              <a 
                href="/contact" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/contact') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Contact
              </a>
              {isAuthenticated && user?.role === 'admin' && (
                <a 
                  href="/admin" 
                  className={`font-medium py-2 px-2 rounded-lg ${
                    isActiveLink('/admin') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </a>
              )}
              
              <div className="pt-3 border-t">
                <Button href="/contact" className="w-full text-center">
                  Devis Gratuit
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
