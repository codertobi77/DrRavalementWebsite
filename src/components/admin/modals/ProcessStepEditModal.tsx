import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface ProcessStep {
  _id?: string;
  title: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

interface ProcessStepEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProcessStep) => void;
  onDelete?: (id: string) => void;
  step?: ProcessStep | null;
  isLoading?: boolean;
}

export default function ProcessStepEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  step,
  isLoading = false
}: ProcessStepEditModalProps) {
  const [formData, setFormData] = useState<ProcessStep>({
    title: '',
    description: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step) {
      setFormData(step);
    } else {
      setFormData({
        title: '',
        description: '',
        order_index: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [step, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
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

  const handleInputChange = (field: keyof ProcessStep, value: string | number | boolean) => {
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

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      onDelete={step?._id ? () => onDelete?.(step._id!) : undefined}
      title={step ? 'Modifier l\'étape' : 'Ajouter une étape'}
      isLoading={isLoading}
      showDelete={!!step?._id}
      deleteLabel="Supprimer l'étape"
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
            placeholder="ex: 1. Consultation"
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
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Description détaillée de l'étape..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
