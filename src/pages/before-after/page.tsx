
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface Project {
  id: string;
  title: string;
  location: string;
  type: string;
  year: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  surface: string;
  duration: string;
  materials: string[];
}

export default function BeforeAfter() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: '1',
      title: 'Ravalement Maison Bourgeoise',
      location: 'Meaux, Seine-et-Marne',
      type: 'ravalement',
      year: '2024',
      beforeImage: 'https://readdy.ai/api/search-image?query=old%20deteriorated%20house%20facade%20with%20peeling%20paint%2C%20cracks%20in%20walls%2C%20weathered%20exterior%2C%20French%20architecture%2C%20before%20renovation%2C%20realistic%20photography%2C%20natural%20lighting%2C%20detailed%20architectural%20elements&width=600&height=400&seq=before1&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=beautiful%20renovated%20house%20facade%20with%20fresh%20white%20paint%2C%20clean%20walls%2C%20modern%20exterior%20finish%2C%20French%20architecture%2C%20after%20renovation%2C%20pristine%20condition%2C%20realistic%20photography%2C%20natural%20lighting%2C%20detailed%20architectural%20elements&width=600&height=400&seq=after1&orientation=landscape',
      description: 'Rénovation complète de la façade avec projection machine et isolation thermique.',
      surface: '280 m²',
      duration: '3 semaines',
      materials: ['Enduit projeté', 'Isolation thermique', 'Peinture façade']
    },
    {
      id: '2',
      title: 'Rénovation Immeuble Haussmannien',
      location: 'Chelles, Seine-et-Marne',
      type: 'ravalement',
      year: '2024',
      beforeImage: 'https://readdy.ai/api/search-image?query=old%20Haussmann%20building%20facade%20with%20damaged%20stone%2C%20dirty%20walls%2C%20worn%20exterior%2C%20Parisian%20architecture%2C%20before%20renovation%2C%20realistic%20photography%2C%20urban%20setting%2C%20detailed%20stonework&width=600&height=400&seq=before2&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=restored%20Haussmann%20building%20facade%20with%20clean%20stone%2C%20beautiful%20walls%2C%20renovated%20exterior%2C%20Parisian%20architecture%2C%20after%20renovation%2C%20elegant%20appearance%2C%20realistic%20photography%2C%20urban%20setting%2C%20detailed%20stonework&width=600&height=400&seq=after2&orientation=landscape',
      description: 'Restauration de façade en pierre avec nettoyage et rejointoiement.',
      surface: '450 m²',
      duration: '5 semaines',
      materials: ['Nettoyage pierre', 'Rejointoiement', 'Traitement hydrofuge']
    },
    {
      id: '3',
      title: 'Isolation Thermique Extérieure',
      location: 'Torcy, Seine-et-Marne',
      type: 'isolation',
      year: '2023',
      beforeImage: 'https://readdy.ai/api/search-image?query=house%20without%20insulation%2C%20plain%20concrete%20walls%2C%20cold%20exterior%20appearance%2C%20modern%20architecture%2C%20before%20thermal%20insulation%2C%20realistic%20photography%2C%20residential%20building%2C%20simple%20facade&width=600&height=400&seq=before3&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=house%20with%20thermal%20insulation%2C%20textured%20exterior%20walls%2C%20warm%20appearance%2C%20modern%20architecture%2C%20after%20insulation%20installation%2C%20realistic%20photography%2C%20residential%20building%2C%20insulated%20facade&width=600&height=400&seq=after3&orientation=landscape',
      description: 'Installation d\'isolation thermique par l\'extérieur avec finition enduit.',
      surface: '180 m²',
      duration: '2 semaines',
      materials: ['Polystyrène expansé', 'Enduit de finition', 'Fixations mécaniques']
    },
    {
      id: '4',
      title: 'Maçonnerie et Clôture',
      location: 'Melun, Seine-et-Marne',
      type: 'maconnerie',
      year: '2023',
      beforeImage: 'https://readdy.ai/api/search-image?query=empty%20property%20without%20fence%2C%20bare%20ground%2C%20no%20boundary%20walls%2C%20residential%20area%2C%20before%20construction%2C%20realistic%20photography%2C%20natural%20lighting%2C%20construction%20site%20preparation&width=600&height=400&seq=before4&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=beautiful%20concrete%20block%20fence%2C%20well-built%20boundary%20wall%2C%20finished%20masonry%20work%2C%20residential%20area%2C%20after%20construction%2C%20realistic%20photography%2C%20natural%20lighting%2C%20professional%20construction&width=600&height=400&seq=after4&orientation=landscape',
      description: 'Construction de clôture en parpaing avec piliers décoratifs.',
      surface: '85 ml',
      duration: '1 semaine',
      materials: ['Parpaings', 'Mortier', 'Chaperon béton']
    },
    {
      id: '5',
      title: 'Réfection Toiture',
      location: 'Le Pecq, Yvelines',
      type: 'couverture',
      year: '2023',
      beforeImage: 'https://readdy.ai/api/search-image?query=old%20damaged%20roof%20with%20missing%20tiles%2C%20worn%20roofing%2C%20weathered%20appearance%2C%20French%20house%2C%20before%20roof%20renovation%2C%20realistic%20photography%2C%20residential%20building%2C%20deteriorated%20roofing&width=600&height=400&seq=before5&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=new%20beautiful%20roof%20with%20fresh%20tiles%2C%20perfect%20roofing%2C%20pristine%20appearance%2C%20French%20house%2C%20after%20roof%20renovation%2C%20realistic%20photography%2C%20residential%20building%2C%20professional%20roofing%20work&width=600&height=400&seq=after5&orientation=landscape',
      description: 'Réfection complète de la toiture avec tuiles mécaniques.',
      surface: '120 m²',
      duration: '2 semaines',
      materials: ['Tuiles mécaniques', 'Liteaux', 'Écran sous-toiture']
    },
    {
      id: '6',
      title: 'Rénovation Façade Moderne',
      location: 'Bussy-Saint-Georges, Seine-et-Marne',
      type: 'ravalement',
      year: '2024',
      beforeImage: 'https://readdy.ai/api/search-image?query=modern%20house%20with%20faded%20exterior%2C%20dull%20colors%2C%20worn%20facade%2C%20contemporary%20architecture%2C%20before%20renovation%2C%20realistic%20photography%2C%20suburban%20setting%2C%20weathered%20appearance&width=600&height=400&seq=before6&orientation=landscape',
      afterImage: 'https://readdy.ai/api/search-image?query=modern%20house%20with%20vibrant%20exterior%2C%20fresh%20colors%2C%20beautiful%20facade%2C%20contemporary%20architecture%2C%20after%20renovation%2C%20realistic%20photography%2C%20suburban%20setting%2C%20pristine%20appearance&width=600&height=400&seq=after6&orientation=landscape',
      description: 'Ravalement avec peinture bi-ton et nettoyage haute pression.',
      surface: '200 m²',
      duration: '2 semaines',
      materials: ['Peinture acrylique', 'Nettoyage HP', 'Traitement anti-mousse']
    }
  ];

  const filters = [
    { id: 'all', name: 'Tous les projets' },
    { id: 'ravalement', name: 'Ravalement' },
    { id: 'isolation', name: 'Isolation' },
    { id: 'maconnerie', name: 'Maçonnerie' },
    { id: 'couverture', name: 'Couverture' }
  ];

  const filteredProjects = selectedFilter === 'all' 
    ? projects 
    : projects.filter(project => project.type === selectedFilter);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Réalisations Avant/Après
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez la transformation de nos projets de rénovation
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full transition-all whitespace-nowrap ${
                  selectedFilter === filter.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
                    <img
                      src={project.beforeImage}
                      alt={`${project.title} - Avant`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Avant
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <i className="ri-map-pin-line mr-2"></i>
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <i className="ri-calendar-line mr-2"></i>
                    <span className="text-sm">{project.year}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-medium text-sm">
                      {project.surface}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Voir le résultat →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Modal */}
          {selectedProject && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProject.title}
                    </h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="relative">
                      <img
                        src={selectedProject.beforeImage}
                        alt="Avant"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Avant
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={selectedProject.afterImage}
                        alt="Après"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Après
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Détails du projet
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <i className="ri-map-pin-line text-orange-600 mr-3"></i>
                          <span>{selectedProject.location}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-ruler-line text-orange-600 mr-3"></i>
                          <span>Surface: {selectedProject.surface}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-time-line text-orange-600 mr-3"></i>
                          <span>Durée: {selectedProject.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-calendar-line text-orange-600 mr-3"></i>
                          <span>Année: {selectedProject.year}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Matériaux utilisés
                      </h3>
                      <div className="space-y-2">
                        {selectedProject.materials.map((material, index) => (
                          <div key={index} className="flex items-center">
                            <i className="ri-check-line text-green-600 mr-3"></i>
                            <span>{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                      className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                    >
                      Demander un devis similaire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Votre projet mérite le même résultat
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contactez-nous pour transformer votre façade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.REACT_APP_NAVIGATE('/quote-calculator')}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-medium"
              >
                Calculer mon devis
              </button>
              <button
                onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors whitespace-nowrap font-medium"
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
