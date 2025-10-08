
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                À Propos de <span className="text-orange-400">DR RAVALEMENT</span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Depuis 2008, nous sommes votre partenaire de confiance pour tous vos travaux de ravalement de façades et de maçonnerie en Seine-et-Marne et Île-de-France.
              </p>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Fondée en 2008, DR RAVALEMENT est née de la passion de son dirigeant pour les métiers du bâtiment et de la rénovation. Spécialisés dans le ravalement de façades par projection machine, nous avons développé notre expertise pour devenir une référence en Seine-et-Marne.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Au fil des années, nous avons élargi nos compétences à la maçonnerie générale et à la couverture, permettant à nos clients de bénéficier d'un service complet pour tous leurs projets de rénovation.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                    <div className="text-gray-600">Façades Rénovées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                    <div className="text-gray-600">Années d'Expérience</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Équipe DR RAVALEMENT au travail" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des principes qui guident chacune de nos interventions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-shield-check-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Qualité</h3>
                <p className="text-gray-600">
                  Nous utilisons uniquement des matériaux de première qualité et appliquons les techniques les plus modernes pour garantir la durabilité de nos travaux.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-time-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ponctualité</h3>
                <p className="text-gray-600">
                  Respect des délais convenus et communication transparente tout au long du projet. Votre temps est précieux, nous le respectons.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-customer-service-2-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Service</h3>
                <p className="text-gray-600">
                  Accompagnement personnalisé de A à Z, conseils d'experts et service après-vente pour votre entière satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des professionnels expérimentés à votre service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Directeur DR RAVALEMENT" 
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">David Rodriguez</h3>
                <p className="text-orange-600 font-medium mb-4">Directeur & Fondateur</p>
                <p className="text-gray-600">
                  15 ans d'expérience dans le ravalement et la maçonnerie. Passionné par l'innovation et la qualité.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Chef d'équipe" 
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Marc Dubois</h3>
                <p className="text-orange-600 font-medium mb-4">Chef d'Équipe Ravalement</p>
                <p className="text-gray-600">
                  Expert en projection machine et finitions façades. Garant de la qualité sur tous nos chantiers.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Responsable commercial" 
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sophie Martin</h3>
                <p className="text-orange-600 font-medium mb-4">Responsable Commerciale</p>
                <p className="text-gray-600">
                  Votre interlocutrice privilégiée pour tous vos projets. Conseil personnalisé et suivi client.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Garanties</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Votre sécurité et votre tranquillité d'esprit sont nos priorités
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Assurance Décennale</h3>
                <p className="text-gray-600 text-sm">Protection complète sur tous nos travaux</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-award-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Qualibat</h3>
                <p className="text-gray-600 text-sm">Certification qualité reconnue</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-leaf-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">RGE</h3>
                <p className="text-gray-600 text-sm">Reconnu Garant de l'Environnement</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-star-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">98% Satisfaction</h3>
                <p className="text-gray-600 text-sm">Clients satisfaits de nos services</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à Démarrer Votre Projet ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Contactez-nous dès aujourd'hui pour un devis gratuit et personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Devis Gratuit
              </a>
              <a 
                href="/portfolio" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
              >
                Voir Nos Réalisations
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
