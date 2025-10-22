import { useState, useEffect, useRef } from 'react';
import EditModal from './EditModal';
import { imageUploadService } from '../../../lib/upload-image';

interface PortfolioProject {
  _id?: string;
  title: string;
  category: string;
  description: string;
  details: string;
  order_index: number;
  is_active: boolean;
  // Champs pour les images avant-après
  before_image: string;
  after_image: string;
  is_before_after: boolean;
}

interface PortfolioProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PortfolioProject) => void;
  onDelete?: (id: string) => void;
  project?: PortfolioProject | null;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS = [
  { key: 'ravalement', label: 'Ravalement' },
  { key: 'maconnerie', label: 'Maçonnerie' },
  { key: 'couverture', label: 'Couverture' },
  { key: 'renovation', label: 'Rénovation' },
  { key: 'isolation', label: 'Isolation' },
  { key: 'peinture', label: 'Peinture' }
];

export default function PortfolioProjectEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  project,
  isLoading = false
}: PortfolioProjectEditModalProps) {
  const [formData, setFormData] = useState<PortfolioProject>({
    title: '',
    category: 'ravalement',
    description: '',
    details: '',
    order_index: 0,
    is_active: true,
    before_image: '',
    after_image: '',
    is_before_after: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [beforeImagePreview, setBeforeImagePreview] = useState<string>('');
  const [afterImagePreview, setAfterImagePreview] = useState<string>('');
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
      setBeforeImagePreview(project.before_image || '');
      setAfterImagePreview(project.after_image || '');
    } else {
      setFormData({
        title: '',
        category: 'ravalement',
        description: '',
        details: '',
        order_index: 0,
        is_active: true,
        before_image: '',
        after_image: '',
        is_before_after: true
      });
      setBeforeImagePreview('');
      setAfterImagePreview('');
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Les détails sont requis';
    }

    if (formData.order_index < 0) {
      newErrors.order_index = 'L\'ordre doit être positif';
    }

    // Validation pour les images avant-après (maintenant obligatoires)
    if (!formData.before_image?.trim()) {
      newErrors.before_image = 'L\'image "avant" est requise';
    }
    if (!formData.after_image?.trim()) {
      newErrors.after_image = 'L\'image "après" est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof PortfolioProject, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBeforeImageUrlChange = (url: string) => {
    handleInputChange('before_image', url);
    setBeforeImagePreview(url);
  };

  const handleAfterImageUrlChange = (url: string) => {
    handleInputChange('after_image', url);
    setAfterImagePreview(url);
  };


  const handleBeforeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBefore(true);

    try {
      const previewUrl = await imageUploadService.createImagePreview(file);
      setBeforeImagePreview(previewUrl);

      const result = await imageUploadService.uploadImage(file, 'projets-avant');
      
      if (result.success && result.url) {
        handleInputChange('before_image', result.url);
      } else {
        alert(result.error || 'Erreur lors de l\'upload de l\'image avant');
      }
      
    } catch (error) {
      console.error('Erreur upload image avant:', error);
      alert('Erreur lors de l\'upload de l\'image avant');
    } finally {
      setIsUploadingBefore(false);
    }
  };

  const handleAfterFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAfter(true);

    try {
      const previewUrl = await imageUploadService.createImagePreview(file);
      setAfterImagePreview(previewUrl);

      const result = await imageUploadService.uploadImage(file, 'projets-apres');
      
      if (result.success && result.url) {
        handleInputChange('after_image', result.url);
      } else {
        alert(result.error || 'Erreur lors de l\'upload de l\'image après');
      }
      
    } catch (error) {
      console.error('Erreur upload image après:', error);
      alert('Erreur lors de l\'upload de l\'image après');
    } finally {
      setIsUploadingAfter(false);
    }
  };

  const triggerBeforeFileUpload = () => {
    beforeFileInputRef.current?.click();
  };

  const triggerAfterFileUpload = () => {
    afterFileInputRef.current?.click();
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      onDelete={project?._id ? () => onDelete?.(project._id!) : undefined}
      title={project ? 'Modifier le projet' : 'Ajouter un projet'}
      isLoading={isLoading}
      showDelete={!!project?._id}
      deleteLabel="Supprimer le projet"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Ravalement Façade Paris 15ème"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Image Avant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image "Avant" *
          </label>
          
          {/* Aperçu de l'image avant */}
            {afterImagePreview && (
            <div className="mb-4">
              <img 
                src={afterImagePreview} 
                alt="Aperçu avant" 
                className="w-32 h-24 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* URL de l'image avant */}
          <input
            type="url"
            value={formData.after_image}
            onChange={(e) => handleBeforeImageUrlChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 ${
              errors.after_image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/avant.jpg"
          />

          {/* Upload de fichier avant */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={triggerAfterFileUpload}
              disabled={isUploadingAfter}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingAfter ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Upload...
                </>
              ) : (
                <>
                  <i className="ri-upload-line mr-2"></i>
                  Upload Image Avant
                </>
              )}
            </button>
            <span className="text-sm text-gray-500">ou entrez une URL</span>
          </div>

          <input
            ref={afterFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAfterFileUpload}
            className="hidden"
          />

          {errors.after_image && <p className="text-red-500 text-sm mt-1">{errors.after_image}</p>}
        </div>

        {/* Image Après */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image "Après" *
          </label>
          
          {/* Aperçu de l'image après */}
          {beforeImagePreview && (
            <div className="mb-4">
              <img 
                src={beforeImagePreview} 
                alt="Aperçu après" 
                className="w-32 h-24 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* URL de l'image après */}
          <input
            type="url"
            value={formData.before_image}
            onChange={(e) => handleAfterImageUrlChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 ${
              errors.before_image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/apres.jpg"
          />

          {/* Upload de fichier après */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={triggerBeforeFileUpload}
              disabled={isUploadingBefore}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingBefore ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Upload...
                </>
              ) : (
                <>
                  <i className="ri-upload-line mr-2"></i>
                  Upload Image Après
                </>
              )}
            </button>
            <span className="text-sm text-gray-500">ou entrez une URL</span>
          </div>

          <input
            ref={beforeFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBeforeFileUpload}
            className="hidden"
          />

          {errors.before_image && <p className="text-red-500 text-sm mt-1">{errors.before_image}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Description du projet..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Détails *
          </label>
          <textarea
            value={formData.details}
            onChange={(e) => handleInputChange('details', e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.details ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Surface: 180m² • Durée: 2 semaines • Finition: Grattée"
          />
          {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordre d'affichage
          </label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.order_index ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.order_index && <p className="text-red-500 text-sm mt-1">{errors.order_index}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Actif
          </label>
        </div>
      </div>
    </EditModal>
  );
}
