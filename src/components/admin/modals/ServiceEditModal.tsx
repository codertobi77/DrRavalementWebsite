import { useState, useEffect, useRef } from 'react';
import EditModal from './EditModal';
import { imageUploadService } from '../../../lib/upload-image';

interface Service {
  _id?: string;
  title: string;
  description: string;
  objective: string;
  image: string;
  features: string[];
  order_index: number;
  is_active: boolean;
}

interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Service) => void;
  onDelete?: (id: string) => void;
  service?: Service | null;
  isLoading?: boolean;
}

export default function ServiceEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  service,
  isLoading = false
}: ServiceEditModalProps) {
  const [formData, setFormData] = useState<Service>({
    title: '',
    description: '',
    objective: '',
    image: '',
    features: [],
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        image: typeof service.image === 'string' ? service.image : ''
      });
      setImagePreview(service.image || '');
    } else {
      setFormData({
        title: '',
        description: '',
        objective: '',
        image: '',
        features: [],
        order_index: 0,
        is_active: true
      });
      setImagePreview('');
    }
    setErrors({});
    setNewFeature('');
  }, [service, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    // L'objectif est maintenant optionnel, pas de validation requise

    if (!formData.image?.trim()) {
      newErrors.image = 'L\'image est requise';
    }

    if (formData.features.length === 0) {
      newErrors.features = 'Au moins une caractéristique est requise';
    }

    if (formData.order_index < 0) {
      newErrors.order_index = 'L\'ordre doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof Service, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      handleInputChange('features', [...formData.features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    handleInputChange('features', newFeatures);
  };

  const handleImageUrlChange = (url: string) => {
    // Vérifier si c'est une data URL trop volumineuse
    if (url.startsWith('data:image/') && url.length > 1024 * 1024) {
      alert('Image trop volumineuse. Veuillez utiliser une image plus petite (max 1MB) ou une URL d\'image externe.');
      return;
    }
    
    handleInputChange('image', url);
    setImagePreview(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Créer un aperçu local immédiatement
      const previewUrl = await imageUploadService.createImagePreview(file);
      setImagePreview(previewUrl);

      // Utiliser le service d'upload pour générer l'URL finale
      const result = await imageUploadService.uploadImage(file, 'services');
      
      if (result.success && result.url) {
        // Mettre à jour l'image avec l'URL finale
        handleInputChange('image', result.url);
      } else {
        alert(result.error || 'Erreur lors de l\'upload de l\'image');
        // Garder l'aperçu local même en cas d'erreur
      }
      
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      onDelete={service?._id ? () => onDelete?.(service._id!) : undefined}
      title={service ? 'Modifier le service' : 'Ajouter un service'}
      isLoading={isLoading}
      showDelete={!!service?._id}
      deleteLabel="Supprimer le service"
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
            placeholder="ex: Ravalement de Façade"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
            placeholder="Description du service..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objectif
          </label>
          <textarea
            value={formData.objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.objective ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Objectif du service (optionnel - ex: Améliorer l'isolation thermique, Renforcer la structure...)"
          />
          {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image du service *
          </label>
          
          {/* Aperçu de l'image */}
          {imagePreview && (
            <div className="mb-4">
              <img 
                src={imagePreview} 
                alt="Aperçu" 
                className="w-24 h-24 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* URL de l'image */}
          <input
            type="url"
            value={formData.image}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2 ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/service-image.jpg"
          />

          {/* Upload de fichier */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={triggerFileUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Upload...
                </>
              ) : (
                <>
                  <i className="ri-upload-line mr-2"></i>
                  Upload Image
                </>
              )}
            </button>
            <span className="text-sm text-gray-500">ou entrez une URL</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caractéristiques *
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ajouter une caractéristique..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
            
            {formData.features.length > 0 && (
              <div className="space-y-1">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
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
