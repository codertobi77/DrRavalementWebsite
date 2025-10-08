
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Nos <span className="text-orange-400">Services</span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Découvrez notre gamme complète de services en ravalement, maçonnerie et couverture
              </p>
            </div>
          </div>
        </section>

        {/* Services Principaux */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Spécialités</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des services complets pour tous vos projets de rénovation
              </p>
            </div>

            {/* Ravalement de Façades */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Ravalement de Façades</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Spécialistes du ravalement par projection machine, nous redonnons vie à vos façades avec des techniques modernes et des finitions variées.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Projection Machine</h4>
                        <p className="text-gray-600">Technique moderne pour un rendu uniforme et durable</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Finitions Variées</h4>
                        <p className="text-gray-600">Grattée, talochée, lissée selon vos préférences</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Nettoyage Haute Pression</h4>
                        <p className="text-gray-600">Préparation optimale des supports</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Isolation Thermique</h4>
                        <p className="text-gray-600">Amélioration des performances énergétiques</p>
                      </div>
                    </li>
                  </ul>
                  <a 
                    href="/contact" 
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
                  >
                    Demander un Devis
                  </a>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Ravalement de façades" 
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Maçonnerie Générale */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Maçonnerie générale" 
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Maçonnerie Générale</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Travaux de maçonnerie pour constructions neuves, extensions, réparations et aménagements extérieurs.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Murs en Parpaing</h4>
                        <p className="text-gray-600">Construction et réparation de murs porteurs</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Clôtures et Murets</h4>
                        <p className="text-gray-600">Délimitation et sécurisation de vos espaces</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Fondations</h4>
                        <p className="text-gray-600">Bases solides pour vos constructions</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Réparations Structurelles</h4>
                        <p className="text-gray-600">Remise en état de structures endommagées</p>
                      </div>
                    </li>
                  </ul>
                  <a 
                    href="/contact" 
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
                  >
                    Demander un Devis
                  </a>
                </div>
              </div>
            </div>

            {/* Couverture */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Couverture & Étanchéité</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Services complets de couverture, réparation de toitures et solutions d'étanchéité pour protéger votre habitat.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Réfection de Toiture</h4>
                        <p className="text-gray-600">Rénovation complète de votre couverture</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Étanchéité Terrasse</h4>
                        <p className="text-gray-600">Protection durable contre les infiltrations</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Zinguerie</h4>
                        <p className="text-gray-600">Gouttières, chéneaux et évacuation des eaux</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <i className="ri-check-line text-orange-600 text-xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Isolation Toiture</h4>
                        <p className="text-gray-600">Amélioration du confort thermique</p>
                      </div>
                    </li>
                  </ul>
                  <a 
                    href="/contact" 
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
                  >
                    Demander un Devis
                  </a>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Couverture et étanchéité" 
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Complémentaires */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Services Complémentaires</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une gamme étendue pour répondre à tous vos besoins
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-paint-brush-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Peinture Extérieure</h3>
                <p className="text-gray-600 mb-4">
                  Application de peintures spécialisées pour façades avec protection longue durée.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Peintures anti-mousse</li>
                  <li>• Revêtements hydrofuges</li>
                  <li>• Finitions décoratives</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-hammer-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Réparations Urgentes</h3>
                <p className="text-gray-600 mb-4">
                  Intervention rapide pour tous types de réparations d'urgence.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Fissures façades</li>
                  <li>• Infiltrations d'eau</li>
                  <li>• Éléments détachés</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-leaf-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Isolation Thermique</h3>
                <p className="text-gray-600 mb-4">
                  Solutions d'isolation pour améliorer les performances énergétiques.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ITE (Isolation par l'extérieur)</li>
                  <li>• Matériaux écologiques</li>
                  <li>• Aides financières</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-water-percent-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nettoyage Façades</h3>
                <p className="text-gray-600 mb-4">
                  Nettoyage professionnel pour redonner éclat à vos façades.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Haute pression</li>
                  <li>• Sablage doux</li>
                  <li>• Traitement anti-mousse</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-building-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Extensions</h3>
                <p className="text-gray-600 mb-4">
                  Agrandissement de votre habitat avec respect de l'existant.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Études de faisabilité</li>
                  <li>• Gros œuvre</li>
                  <li>• Finitions</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-tools-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Maintenance</h3>
                <p className="text-gray-600 mb-4">
                  Contrats de maintenance pour préserver vos investissements.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Inspections régulières</li>
                  <li>• Entretien préventif</li>
                  <li>• Garantie étendue</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Processus</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une méthode éprouvée pour la réussite de votre projet
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnostic</h3>
                <p className="text-gray-600">
                  Évaluation complète de l'état de vos façades et identification des besoins.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Devis</h3>
                <p className="text-gray-600">
                  Proposition détaillée avec solutions techniques et tarification transparente.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Réalisation</h3>
                <p className="text-gray-600">
                  Exécution des travaux par nos équipes qualifiées avec suivi quotidien.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Livraison</h3>
                <p className="text-gray-600">
                  Réception des travaux, nettoyage du chantier et remise des garanties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Besoin d'un Devis Personnalisé ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Contactez nos experts pour une étude gratuite de votre projet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Devis Gratuit
              </a>
              <a 
                href="tel:+33139589015" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
              >
                Appeler Maintenant
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
