import { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import ConfirmationModal from '../../../components/base/ConfirmationModal';
import { useOptimizedAdminProjects, useOptimizedAdminProjectsByStatus } from '../../../hooks/useOptimizedCmsData';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirmation } from '../../../hooks/useConfirmation';

interface Project {
  _id: string;
  client_id?: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  start_date: string;
  end_date: string;
  budget: number;
  address: string;
  client_name?: string;
  client_email?: string;
}

export default function ProjectManagement() {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'planning' | 'in-progress' | 'completed' | 'on-hold'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks pour les toasters et confirmations
  const { showSuccess, showError, showWarning } = useToast();
  const { isOpen, isLoading, options, confirm, handleConfirm, handleCancel } = useConfirmation();

  // Utiliser les hooks optimisés avec cache
  const { data: allProjects, isLoading: allProjectsLoading, refresh: refreshAllProjects } = useOptimizedAdminProjects();
  const { data: projectsByStatus, isLoading: projectsByStatusLoading, refresh: refreshProjectsByStatus } = useOptimizedAdminProjectsByStatus(filter);

  // Mutations
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  // Utiliser les données filtrées ou tous les projets
  const projects = filter === 'all' ? allProjects : projectsByStatus;
  const loading = filter === 'all' ? allProjectsLoading : projectsByStatusLoading;

  // Filtrer les projets par terme de recherche
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];
  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    try {
      await updateProject({ id: projectId as any, status });
      setSelectedProject(null);
      refreshAllProjects();
      refreshProjectsByStatus();
      showSuccess('Statut mis à jour', 'Le statut du projet a été modifié avec succès.');
    } catch (error) {
      console.error('Error updating project status:', error);
      showError('Erreur de mise à jour', 'Impossible de modifier le statut du projet.');
    }
  };

  const updateProjectProgress = async (projectId: string, progress: number) => {
    try {
      await updateProject({ id: projectId as any, progress });
      refreshAllProjects();
      refreshProjectsByStatus();
      showSuccess('Progrès mis à jour', `Le progrès du projet a été mis à jour à ${progress}%.`);
    } catch (error) {
      console.error('Error updating project progress:', error);
      showError('Erreur de mise à jour', 'Impossible de modifier le progrès du projet.');
    }
  };

  const deleteProjectHandler = async (projectId: string) => {
    const project = projects?.find(p => p._id === projectId);
    confirm({
      title: 'Supprimer le projet',
      message: `Êtes-vous sûr de vouloir supprimer le projet "${project?.title}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteProject({ id: projectId as any });
          setSelectedProject(null);
          refreshAllProjects();
          refreshProjectsByStatus();
          showSuccess('Projet supprimé', 'Le projet a été supprimé avec succès.');
        } catch (error) {
          console.error('Error deleting project:', error);
          showError('Erreur de suppression', 'Impossible de supprimer le projet.');
        }
      },
    });
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
      case 'planning': return 'Planification';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En attente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets</h1>
            <p className="text-gray-600 mt-2">Créez et gérez vos projets de rénovation</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                refreshAllProjects();
                refreshProjectsByStatus();
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir
            </Button>
            <Button
              onClick={() => console.log('Nouveau projet')}
            >
              <i className="ri-add-line mr-2"></i>
              Nouveau Projet
            </Button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Titre, description, client, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="planning">Planification</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminés</option>
                <option value="on-hold">En attente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Projets ({filteredProjects.length})
            </h3>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-folder-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Aucun projet ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier projet.'}
              </p>
              <Button onClick={() => console.log('Nouveau projet')}>
                <i className="ri-add-line mr-2"></i>
                Créer un Projet
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <div key={project._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {project.title}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="ri-user-line mr-1"></i>
                          {project.client_name || 'Client non défini'}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-map-pin-line mr-1"></i>
                          {project.address}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-money-euro-circle-line mr-1"></i>
                          {project.budget.toLocaleString()} €
                        </span>
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          {project.start_date} → {project.end_date}
                        </span>
                      </div>

                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Voir détails"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>

                      <button
                        onClick={() => console.log('Modifier', project._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-lg"></i>
                      </button>

                      <button
                        onClick={() => deleteProjectHandler(project._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail du projet */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateStatus={updateProjectStatus}
          onUpdateProgress={updateProjectProgress}
          onDelete={deleteProjectHandler}
        />
      )}
    </AdminLayout>
  );
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Project['status']) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
}

function ProjectDetailModal({ project, onClose, onUpdateStatus, onUpdateProgress, onDelete }: ProjectDetailModalProps) {
  const [progress, setProgress] = useState(project.progress);

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
      case 'planning': return 'Planification';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Détails du Projet
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <p className="text-sm text-gray-900">{project.client_name || 'N/A'}</p>
              <p className="text-sm text-gray-900">{project.client_email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <p className="text-sm text-gray-900">{project.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <p className="text-sm text-gray-900">{project.budget.toLocaleString()} €</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progrès</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => onUpdateProgress(project._id, progress)}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
              <p className="text-sm text-gray-900">{project.start_date}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
              <p className="text-sm text-gray-900">{project.end_date}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          {project.status === 'planning' && (
            <Button
              onClick={() => onUpdateStatus(project._id, 'in-progress')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <i className="ri-play-line mr-2"></i>
              Démarrer
            </Button>
          )}
          {project.status === 'in-progress' && (
            <Button
              onClick={() => onUpdateStatus(project._id, 'completed')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <i className="ri-check-line mr-2"></i>
              Terminer
            </Button>
          )}
          <Button
            onClick={() => onDelete(project._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <i className="ri-delete-bin-line mr-2"></i>
            Supprimer
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fermer
          </Button>
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={isLoading}
      />
    </div>
  );
}