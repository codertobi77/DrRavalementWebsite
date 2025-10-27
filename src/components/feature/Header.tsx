
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PriorityContactInfoSection from '../cms/PriorityContactInfoSection';
import { usePriorityAppearanceConfig } from '../../lib/priority-cache';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const appearanceConfig = usePriorityAppearanceConfig();

  // Données d'apparence avec fallback
  const siteName = appearanceConfig.data?.siteName || 'DR RAVALEMENT';
  const tagline = appearanceConfig.data?.tagline || 'Expert Façades & Maçonnerie';
  const primaryColor = appearanceConfig.data?.primaryColor || '#ea580c';

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
            <PriorityContactInfoSection variant="header" />
          
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo intégré */}
          <a href="/" className="flex items-center space-x-2 lg:space-x-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
              }}
            >
              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">DR</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{siteName}</h1>
            </div>
          </a>

          {/* Navigation desktop - Positionnée à droite */}
          <div className="flex items-center">
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
                href="/blog" 
                className={`font-medium transition-colors duration-200 text-sm ${
                  isActiveLink('/blog') 
                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                Actualités/Blog
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
            </nav>

            {/* Mobile menu button */}
            <button 
              className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl sm:text-2xl`}></i>
            </button>
          </div>
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
                href="/blog" 
                className={`font-medium py-2 px-2 rounded-lg ${
                  isActiveLink('/blog') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Actualités/Blog
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
