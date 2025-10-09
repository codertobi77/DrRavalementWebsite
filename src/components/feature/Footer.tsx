
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">DR</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">DR RAVALEMENT</h3>
                <p className="text-orange-400 text-xs sm:text-sm">Expert Façades & Maçonnerie</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Spécialiste du ravalement de façades par projection machine et maçonnerie générale en Seine-et-Marne depuis 2008.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-facebook-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-twitter-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-linkedin-fill text-lg sm:text-xl"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Nos Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Ravalement de Façades
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Projection Machine
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Maçonnerie Générale
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Couverture
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Clôtures Parpaing
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm">
                  Isolation Thermique
                </a>
              </li>
            </ul>
          </div>

          {/* Zones */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Zones d'Intervention</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-gray-300 text-xs sm:text-sm">Le Pecq</li>
              <li className="text-gray-300 text-xs sm:text-sm">Seine-et-Marne</li>
              <li className="text-gray-300 text-xs sm:text-sm">Meaux</li>
              <li className="text-gray-300 text-xs sm:text-sm">Chelles</li>
              <li className="text-gray-300 text-xs sm:text-sm">Torcy</li>
              <li className="text-gray-300 text-xs sm:text-sm">Melun</li>
            </ul>
            <a href="/contact" className="inline-block mt-3 sm:mt-4 text-orange-400 hover:text-orange-300 transition-colors text-xs sm:text-sm">
              Voir toutes les zones →
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <i className="ri-phone-line text-orange-400 flex-shrink-0"></i>
                <span className="text-gray-300 text-xs sm:text-sm">+33 1 39 58 90 15</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-mail-line text-orange-400 flex-shrink-0"></i>
                <span className="text-gray-300 text-xs sm:text-sm break-all">contact@dr-ravalement.fr</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-map-pin-line text-orange-400 flex-shrink-0"></i>
                <span className="text-gray-300 text-xs sm:text-sm">Seine-et-Marne & Île-de-France</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-time-line text-orange-400 flex-shrink-0"></i>
                <span className="text-gray-300 text-xs sm:text-sm">Lun-Ven: 8h-18h | Sam: 9h-12h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Accueil</a>
            <a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">À Propos</a>
            <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Services</a>
            <a href="/portfolio" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Réalisations</a>
            <a href="/blog" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Blog</a>
            <a href="/careers" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Carrières</a>
            <a href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Contact</a>
            <a href="/admin" className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center">
              <i className="ri-settings-3-line mr-1"></i>
              Admin
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">© 2024 DR RAVALEMENT. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-xs sm:text-sm">Mentions Légales</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-xs sm:text-sm">Politique de Confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-xs sm:text-sm">CGV</a>
            <a href="https://readdy.ai/?origin=logo" className="text-gray-400 hover:text-orange-400 transition-colors text-xs sm:text-sm">Website Builder</a>
          </div>
        </div>
      </div>
    </footer>
  );
}