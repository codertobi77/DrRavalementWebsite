import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface Service {
  _id?: string;
  title: string;
  description: string;
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
    image: '',
    features: [],
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        features: [],
        order_index: 0,
        is_active: true
      });
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

    if (!formData.image.trim()) {
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
            URL de l'image *
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => handleInputChange('image', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
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
