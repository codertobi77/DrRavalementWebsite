
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('tous');

  const projects = [
    {
      id: 1,
      title: 'Ravalement Maison Individuelle - Le Pecq',
      category: 'ravalement',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Rénovation complète de façade avec projection machine et finition grattée.',
      details: 'Surface: 180m² • Durée: 2 semaines • Finition: Grattée'
    },
    {
      id: 2,
      title: 'Construction Mur Clôture - Meaux',
      category: 'maconnerie',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Édification d\'un mur de clôture en parpaing avec finition enduit.',
      details: 'Longueur: 45m • Hauteur: 2m • Matériau: Parpaing'
    },
    {
      id: 3,
      title: 'Réfection Toiture - Chelles',
      category: 'couverture',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Rénovation complète de toiture avec isolation thermique.',
      details: 'Surface: 120m² • Matériau: Tuiles • Isolation: Laine de roche'
    },
    {
      id: 4,
      title: 'Ravalement Immeuble - Torcy',
      category: 'ravalement',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Rénovation de façade d\'immeuble avec isolation thermique extérieure.',
      details: 'Surface: 450m² • Étages: 4 • ITE: 10cm'
    },
    {
      id: 5,
      title: 'Extension Maison - Melun',
      category: 'maconnerie',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Construction d\'une extension avec fondations et élévation.',
      details: 'Surface: 35m² • Fondations: Béton armé • Murs: Parpaing'
    },
    {
      id: 6,
      title: 'Étanchéité Terrasse - Yvelines',
      category: 'couverture',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Réfection complète d\'étanchéité de terrasse accessible.',
      details: 'Surface: 80m² • Membrane: EPDM • Isolation: Polyuréthane'
    },
    {
      id: 7,
      title: 'Ravalement Villa - Val-d\'Oise',
      category: 'ravalement',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Rénovation de façade de villa avec finition talochée.',
      details: 'Surface: 220m² • Finition: Talochée • Couleur: Blanc cassé'
    },
    {
      id: 8,
      title: 'Mur de Soutènement - Essonne',
      category: 'maconnerie',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Construction d\'un mur de soutènement en béton armé.',
      details: 'Longueur: 25m • Hauteur: 3m • Drainage: Inclus'
    },
    {
      id: 9,
      title: 'Rénovation Toiture - Hauts-de-Seine',
      category: 'couverture',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Réfection complète avec zinguerie et isolation.',
      details: 'Surface: 95m² • Tuiles: Mécaniques • Zinguerie: Zinc'
    }
  ];

  const filteredProjects = activeFilter === 'tous' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

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
                Nos <span className="text-orange-400">Réalisations</span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Découvrez nos projets de ravalement, maçonnerie et couverture réalisés en Seine-et-Marne et Île-de-France
              </p>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Façades Rénovées</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
                <div className="text-gray-600 font-medium">Années d'Expérience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600 font-medium">Clients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">25+</div>
                <div className="text-gray-600 font-medium">Communes Servies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveFilter('tous')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'tous'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                Tous les Projets
              </button>
              <button
                onClick={() => setActiveFilter('ravalement')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'ravalement'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                Ravalement
              </button>
              <button
                onClick={() => setActiveFilter('maconnerie')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'maconnerie'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                Maçonnerie
              </button>
              <button
                onClick={() => setActiveFilter('couverture')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === 'couverture'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                Couverture
              </button>
            </div>
          </div>
        </section>

        {/* Galerie de Projets */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.category === 'ravalement' ? 'bg-blue-100 text-blue-800' :
                        project.category === 'maconnerie' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {project.category === 'ravalement' ? 'Ravalement' :
                         project.category === 'maconnerie' ? 'Maçonnerie' : 'Couverture'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="text-sm text-gray-500 mb-4">{project.details}</div>
                    <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                      <span>Voir les détails</span>
                      <i className="ri-arrow-right-line ml-2"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce Que Disent Nos Clients</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La satisfaction de nos clients témoigne de la qualité de nos réalisations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-orange-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "Excellent travail sur notre façade. L'équipe de DR RAVALEMENT est professionnelle et respecte les délais. Le résultat dépasse nos attentes."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                    alt="Marie Dubois" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Marie Dubois</h4>
                    <p className="text-gray-600 text-sm">Le Pecq</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-orange-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "Très satisfait de la construction de notre mur de clôture. Travail soigné et prix compétitif. Je recommande vivement."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150" 
                    alt="Pierre Martin" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Pierre Martin</h4>
                    <p className="text-gray-600 text-sm">Meaux</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-orange-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "Réfection de toiture impeccable. Équipe compétente et matériaux de qualité. Notre maison a retrouvé une seconde jeunesse."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150" 
                    alt="Sophie Leroy" 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sophie Leroy</h4>
                    <p className="text-gray-600 text-sm">Chelles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Votre Projet Sera Notre Prochaine Réalisation
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Rejoignez nos clients satisfaits et confiez-nous votre projet de rénovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Demander un Devis
              </a>
              <a 
                href="tel:+33139589015" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
              >
                Nous Appeler
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
