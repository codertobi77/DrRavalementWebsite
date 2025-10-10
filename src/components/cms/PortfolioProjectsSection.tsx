import { useState } from 'react';
import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedPortfolioProjects, useCachedProjectFilters } from "../../lib/cms-cache";

export default function PortfolioProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('tous');
  const { data: rawProjects, isLoading: projectsLoading, isCached: projectsCached } = useCachedPortfolioProjects();
  const { data: rawFilters, isLoading: filtersLoading, isCached: filtersCached } = useCachedProjectFilters();

  // Validation et déduplication des données
  const projects = validateCmsData(
    rawProjects,
    (items) => deduplicateByKey(items, 'title'),
    "Aucun projet disponible"
  );

  const filters = validateCmsData(
    rawFilters,
    (items) => deduplicateByKey(items, 'key'),
    "Aucun filtre disponible"
  );

  const filteredProjects = projects?.filter(project => 
    activeFilter === 'tous' || project.category === activeFilter
  ) || [];

  if (!projects || !filters || projectsLoading || filtersLoading) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtres de chargement */}
          <div className="py-8 bg-gray-50">
            <div className="flex flex-wrap justify-center gap-4">
              {createLoadingState(4).map((item) => (
                <div key={item._id} className="bg-gray-300 rounded-full px-6 py-3 h-12 w-32 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Projets de chargement */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {createLoadingState(6).map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicateurs de cache */}
          {(projectsCached || filtersCached) && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <i className="ri-database-line mr-1"></i>
              Données chargées depuis le cache
            </div>
          )}
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtres */}
          <div className="py-8 bg-gray-50">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <button
                  key={filter._id}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Galerie de Projets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-project.jpg';
                    }}
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

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-image-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-gray-600">
                Aucun projet ne correspond au filtre sélectionné
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    logCmsError("PortfolioProjectsSection", error, projects);
    return (
      <div className="text-center py-12 text-gray-600">
        <p>Erreur lors du chargement des projets</p>
      </div>
    );
  }
}
