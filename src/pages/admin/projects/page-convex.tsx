import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

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

  // Hooks Convex
  const allProjects = useQuery(api.projects.getAllProjects);
  const projectsByStatus = useQuery(
    api.projects.getProjectsByStatus,
    filter !== 'all' ? { status: filter } : "skip"
  );

  // Mutations
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  // Utiliser les données filtrées ou tous les projets
  const projects = filter === 'all' ? allProjects : projectsByStatus;
  const loading = projects === undefined;

  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    try {
      await updateProject({ id: projectId as any, status });
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const updateProjectProgress = async (projectId: string, progress: number) => {
    try {
      await updateProject({ id: projectId as any, progress });
    } catch (error) {
      console.error('Error updating project progress:', error);
      setError('Erreur lors de la mise à jour du progrès');
    }
  };

  const deleteProjectHandler = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await deleteProject({ id: projectId as any });
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Erreur lors de la suppression');
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
      case 'planning': return 'Planification';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En attente';
      default: return status;
    }
  };

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
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Gestion des Projets</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Erreur:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <Button
                onClick={() => console.log('Nouveau projet')}
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
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Tous', count: allProjects?.length || 0 },
                { key: 'planning', label: 'Planification', count: projectsByStatus?.length || 0 },
                { key: 'in-progress', label: 'En cours', count: projectsByStatus?.length || 0 },
                { key: 'completed', label: 'Terminés', count: projectsByStatus?.length || 0 },
                { key: 'on-hold', label: 'En attente', count: projectsByStatus?.length || 0 }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Liste des projets */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progrès
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects?.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {project.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.client_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{project.client_email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.budget.toLocaleString()} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{project.start_date}</div>
                        <div>→ {project.end_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => console.log('Modifier', project._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => deleteProjectHandler(project._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {projects?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucun projet trouvé pour le statut "{filter === 'all' ? 'tous' : getStatusLabel(filter)}".
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

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
    </div>
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Détails du Projet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-sm text-gray-900">{project.client_name || 'N/A'}</p>
              <p className="text-sm text-gray-900">{project.client_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Adresse</p>
              <p className="text-sm text-gray-900">{project.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p className="text-sm text-gray-900">{project.budget.toLocaleString()} €</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Progrès</p>
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
              <p className="text-sm font-medium text-gray-500">Date de début</p>
              <p className="text-sm text-gray-900">{project.start_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date de fin</p>
              <p className="text-sm text-gray-900">{project.end_date}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
}
