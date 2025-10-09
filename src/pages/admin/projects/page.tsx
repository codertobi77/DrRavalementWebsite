import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  start_date: string;
  end_date: string;
  budget: number;
  address: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_email?: string;
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'planning' | 'in-progress' | 'completed' | 'on-hold'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par de vraies données de l'API
      setTimeout(() => {
        setProjects([
          {
            id: '1',
            client_id: 'client1',
            title: 'Ravalement façade maison individuelle',
            description: 'Ravalement complet d\'une façade de maison individuelle avec projection machine',
            status: 'in-progress',
            progress: 65,
            start_date: '2024-01-15',
            end_date: '2024-02-15',
            budget: 15000,
            address: '123 Rue de la Paix, 75001 Paris',
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-20T14:30:00Z',
            client_name: 'Jean Dupont',
            client_email: 'jean.dupont@email.com'
          },
          {
            id: '2',
            client_id: 'client2',
            title: 'Rénovation immeuble collectif',
            description: 'Rénovation complète de la façade d\'un immeuble de 5 étages',
            status: 'planning',
            progress: 20,
            start_date: '2024-02-01',
            end_date: '2024-04-01',
            budget: 45000,
            address: '456 Avenue des Champs, 75008 Paris',
            created_at: '2024-01-05T09:00:00Z',
            updated_at: '2024-01-18T11:15:00Z',
            client_name: 'Marie Martin',
            client_email: 'marie.martin@email.com'
          },
          {
            id: '3',
            client_id: 'client3',
            title: 'Isolation thermique par l\'extérieur',
            description: 'Pose d\'ITE avec enduit décoratif sur façade existante',
            status: 'completed',
            progress: 100,
            start_date: '2023-11-01',
            end_date: '2023-12-15',
            budget: 25000,
            address: '789 Boulevard Saint-Germain, 75006 Paris',
            created_at: '2023-10-15T08:30:00Z',
            updated_at: '2023-12-15T16:45:00Z',
            client_name: 'Pierre Durand',
            client_email: 'pierre.durand@email.com'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Erreur lors du chargement des projets');
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    try {
      // TODO: Implémenter la mise à jour réelle
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status } : project
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'En planification';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En attente';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion des projets
                </h1>
                <p className="text-gray-600">
                  Suivez et gérez tous vos projets de ravalement
                </p>
              </div>
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Retour au tableau de bord
              </Link>
            </div>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            </div>
          )}

          {/* Barre d'outils */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Nouveau projet
                </Button>
                <Button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="ri-download-line mr-2"></i>
                  Exporter
                </Button>
              </div>

              {/* Filtres */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous ({projects.length})</option>
                    <option value="planning">En planification ({projects.filter(p => p.status === 'planning').length})</option>
                    <option value="in-progress">En cours ({projects.filter(p => p.status === 'in-progress').length})</option>
                    <option value="completed">Terminés ({projects.filter(p => p.status === 'completed').length})</option>
                    <option value="on-hold">En attente ({projects.filter(p => p.status === 'on-hold').length})</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des projets */}
          <div className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <i className="ri-building-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Commencez par créer votre premier projet'
                    : `Aucun projet avec le statut "${getStatusLabel(filter as any)}"`
                  }
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={() => setSelectedProject(project)}
                  onUpdateStatus={updateProjectStatus}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateStatus={updateProjectStatus}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Composant pour la carte de projet
function ProjectCard({ 
  project, 
  onView, 
  onUpdateStatus, 
  getStatusColor, 
  getStatusLabel 
}: {
  project: Project;
  onView: () => void;
  onUpdateStatus: (id: string, status: Project['status']) => void;
  getStatusColor: (status: Project['status']) => string;
  getStatusLabel: (status: Project['status']) => string;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {project.title}
              </h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="ri-user-line mr-2"></i>
                {project.client_name}
              </span>
              <span className="flex items-center">
                <i className="ri-map-pin-line mr-2"></i>
                {project.address}
              </span>
              <span className="flex items-center">
                <i className="ri-money-euro-circle-line mr-2"></i>
                {formatCurrency(project.budget)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
            >
              <i className="ri-eye-line"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <i className="ri-edit-line"></i>
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-500">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Dates et actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <i className="ri-calendar-line mr-2"></i>
              Début: {new Date(project.start_date).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex items-center">
              <i className="ri-calendar-check-line mr-2"></i>
              Fin: {new Date(project.end_date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {project.status === 'planning' && (
              <Button
                onClick={() => onUpdateStatus(project.id, 'in-progress')}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Démarrer
              </Button>
            )}
            {project.status === 'in-progress' && (
              <Button
                onClick={() => onUpdateStatus(project.id, 'completed')}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Terminer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de détails du projet
function ProjectDetailsModal({ 
  project, 
  onClose, 
  onUpdateStatus, 
  getStatusColor, 
  getStatusLabel 
}: {
  project: Project;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Project['status']) => void;
  getStatusColor: (status: Project['status']) => string;
  getStatusLabel: (status: Project['status']) => string;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Détails du projet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Informations générales */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Informations générales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <p className="text-sm text-gray-900">{project.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <p className="text-sm text-gray-900">{formatCurrency(project.budget)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Progression</label>
                <p className="text-sm text-gray-900">{project.progress}%</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-sm text-gray-900">{project.description}</p>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <p className="text-sm text-gray-900">{project.address}</p>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Planning</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <p className="text-sm text-gray-900">
                  {new Date(project.start_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin prévue</label>
                <p className="text-sm text-gray-900">
                  {new Date(project.end_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {project.status === 'planning' && (
              <Button
                onClick={() => onUpdateStatus(project.id, 'in-progress')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="ri-play-line mr-2"></i>
                Démarrer le projet
              </Button>
            )}
            {project.status === 'in-progress' && (
              <Button
                onClick={() => onUpdateStatus(project.id, 'completed')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="ri-check-double-line mr-2"></i>
                Marquer comme terminé
              </Button>
            )}
            <Button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
