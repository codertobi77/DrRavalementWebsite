import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  url: string;
  size: number;
  mime_type: string;
  alt_text?: string;
  description?: string;
  created_at: string;
}

export default function MediaManagement() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par de vraies données de l'API
      setTimeout(() => {
        setMediaFiles([
          {
            id: '1',
            name: 'facade-avant.jpg',
            type: 'image',
            url: '/images/facade-avant.jpg',
            size: 2048576,
            mime_type: 'image/jpeg',
            alt_text: 'Façade avant rénovation',
            description: 'Photo de la façade avant les travaux de ravalement',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: 'facade-apres.jpg',
            type: 'image',
            url: '/images/facade-apres.jpg',
            size: 1856432,
            mime_type: 'image/jpeg',
            alt_text: 'Façade après rénovation',
            description: 'Photo de la façade après les travaux de ravalement',
            created_at: '2024-01-15T10:05:00Z'
          },
          {
            id: '3',
            name: 'presentation-entreprise.pdf',
            type: 'document',
            url: '/documents/presentation-entreprise.pdf',
            size: 5242880,
            mime_type: 'application/pdf',
            description: 'Présentation de l\'entreprise DR RAVALEMENT',
            created_at: '2024-01-10T14:30:00Z'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading media files:', error);
      setError('Erreur lors du chargement des fichiers');
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      // TODO: Implémenter l'upload réel
      console.log('Uploading files:', files);
      // Simuler l'upload
      setTimeout(() => {
        setUploading(false);
        // Recharger la liste
        loadMediaFiles();
      }, 2000);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} fichier(s) ?`)) {
      return;
    }

    try {
      // TODO: Implémenter la suppression réelle
      console.log('Deleting files:', selectedFiles);
      setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return 'ri-image-line';
      case 'video': return 'ri-video-line';
      case 'document': return 'ri-file-text-line';
      default: return 'ri-file-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFiles = mediaFiles.filter(file => 
    filter === 'all' || file.type === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-300 rounded"></div>
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
                  Gestion des médias
                </h1>
                <p className="text-gray-600">
                  Gérez vos images, vidéos et documents
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
                <label className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
                  <i className="ri-upload-line mr-2"></i>
                  {uploading ? 'Upload en cours...' : 'Ajouter des fichiers'}
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                
                {selectedFiles.length > 0 && (
                  <Button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Supprimer ({selectedFiles.length})
                  </Button>
                )}
              </div>

              {/* Filtres et vue */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Type:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="image">Images</option>
                    <option value="video">Vidéos</option>
                    <option value="document">Documents</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Vue:</span>
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <i className="ri-grid-line"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <i className="ri-list-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des fichiers */}
          <div className="bg-white rounded-lg shadow">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-image-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun fichier trouvé
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Commencez par ajouter vos premiers fichiers'
                    : `Aucun fichier de type "${filter}" trouvé`
                  }
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFiles.map((file) => (
                    <MediaCard
                      key={file.id}
                      file={file}
                      isSelected={selectedFiles.includes(file.id)}
                      onSelect={() => handleFileSelect(file.id)}
                      formatFileSize={formatFileSize}
                      getFileIcon={getFileIcon}
                      getTypeColor={getTypeColor}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taille
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleFileSelect(file.id)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className={`${getFileIcon(file.type)} text-2xl text-gray-400 mr-3`}></i>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              {file.alt_text && (
                                <div className="text-sm text-gray-500">{file.alt_text}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(file.type)}`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(file.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-orange-600 hover:text-orange-900">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Composant pour la carte de média
function MediaCard({ 
  file, 
  isSelected, 
  onSelect, 
  formatFileSize, 
  getFileIcon, 
  getTypeColor 
}: {
  file: MediaFile;
  isSelected: boolean;
  onSelect: () => void;
  formatFileSize: (bytes: number) => string;
  getFileIcon: (type: string) => string;
  getTypeColor: (type: string) => string;
}) {
  return (
    <div 
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-orange-500 bg-orange-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        {file.type === 'image' ? (
          <img 
            src={file.url} 
            alt={file.alt_text || file.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <i className={`${getFileIcon(file.type)} text-4xl text-gray-400`}></i>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(file.type)}`}>
            {file.type}
          </span>
          <span className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </span>
        </div>
        {file.alt_text && (
          <p className="text-xs text-gray-600 truncate">
            {file.alt_text}
          </p>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
          <i className="ri-check-line text-sm"></i>
        </div>
      )}
    </div>
  );
}
