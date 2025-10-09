
import { useState } from 'react';
import Button from '../base/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-orange-600 text-white py-2">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <i className="ri-phone-line text-xs sm:text-sm"></i>
                <span className="hidden sm:inline">+33 1 39 58 90 15</span>
                <span className="sm:hidden">01 39 58 90 15</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <i className="ri-mail-line"></i>
                <span>contact@dr-ravalement.fr</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <i className="ri-map-pin-line"></i>
                <span>Seine-et-Marne & Île-de-France</span>
              </div>
            </div>
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
            <a href="/" className="font-medium transition-colors duration-200 text-orange-600 border-b-2 border-orange-600 pb-1 text-sm">
              Accueil
            </a>
            <a href="/about" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              À Propos
            </a>
            <a href="/services" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              Services
            </a>
            <a href="/portfolio" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              Réalisations
            </a>
            <a href="/booking" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              Rendez-vous
            </a>
            <a href="/client-dashboard" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              Espace Client
            </a>
            <a href="/contact" className="font-medium transition-colors duration-200 text-gray-700 hover:text-orange-600 text-sm">
              Contact
            </a>
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
              <a href="/" className="font-medium text-orange-600 py-2 px-2 rounded-lg bg-orange-50">Accueil</a>
              <a href="/about" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">À Propos</a>
              <a href="/services" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">Services</a>
              <a href="/portfolio" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">Réalisations</a>
              
              
              <a href="/booking" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">Rendez-vous</a>
              <a href="/client-dashboard" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">Espace Client</a>
              <a href="/contact" className="font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50">Contact</a>
              
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
