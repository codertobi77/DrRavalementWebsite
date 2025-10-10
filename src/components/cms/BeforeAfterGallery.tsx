import { useState } from 'react';
import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function BeforeAfterGallery() {
  // Utiliser directement la fonction getBeforeAfterProjects
  const rawProjects = useQuery(api.cms.getBeforeAfterProjects);
  const isLoading = rawProjects === undefined;

  // Debug logs
  console.log('🔍 BeforeAfterGallery Debug:');
  console.log('- rawProjects:', rawProjects?.length || 0);
  console.log('- isLoading:', isLoading);

  // Validation et déduplication des données
  const beforeAfterProjects = validateCmsData(
    rawProjects,
    (items) => deduplicateByKey(items, 'title'),
    "Aucun projet avant-après disponible"
  ) || [];

  console.log('- beforeAfterProjects after validation:', beforeAfterProjects.length);
  console.log('- beforeAfterProjects details:', beforeAfterProjects.map(p => ({
    title: p.title,
    is_before_after: p.is_before_after,
    has_before: !!p.before_image,
    has_after: !!p.after_image
  })));

  if (!rawProjects || isLoading) {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {createLoadingState(6).map((item) => (
              <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8">
              <i className="ri-image-line text-4xl text-orange-600"></i>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Galerie Avant/Après
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez la transformation de nos réalisations. 
              Glissez sur les images pour voir l'effet avant/après.
            </p>
          </div>

          {/* Galerie Avant/Après */}
          {beforeAfterProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beforeAfterProjects.map((project) => (
                <BeforeAfterCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="ri-image-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune réalisation avant/après disponible
              </h3>
              <p className="text-gray-600">
                Les réalisations avant/après seront bientôt disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    logCmsError("BeforeAfterGallery", error, beforeAfterProjects);
    return (
      <div className="text-center py-12 text-gray-600">
        <p>Erreur lors du chargement de la galerie avant/après</p>
      </div>
    );
  }
}

// Composant pour une carte avant/après individuelle
function BeforeAfterCard({ project }: { project: any }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image avant/après */}
      <div 
        className="relative h-64 overflow-hidden cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={() => setSliderPosition(50)}
      >
        {/* Image avant */}
        <div className="absolute inset-0">
          <img 
            src={project.before_image} 
            alt={`${project.title} - Avant`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-before.jpg';
            }}
          />
        </div>
        
        {/* Image après */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={project.after_image} 
            alt={`${project.title} - Après`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-after.jpg';
            }}
          />
        </div>
        
        {/* Curseur de comparaison */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <i className="ri-drag-move-2-line text-gray-600 text-sm"></i>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
          Avant
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
          Après
        </div>
        
        {/* Badge de catégorie */}
        <div className="absolute bottom-4 left-4">
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
      
      {/* Contenu de la carte */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="text-sm text-gray-500 mb-4">{project.details}</div>
        
        {/* Instructions d'utilisation */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 flex items-center">
            <i className="ri-drag-move-2-line mr-2"></i>
            Glissez pour comparer avant/après
          </p>
        </div>
        
        <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
          <span>Voir les détails</span>
          <i className="ri-arrow-right-line ml-2"></i>
        </button>
      </div>
    </div>
  );
}
