import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface Reason {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

interface ReasonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Reason) => void;
  onDelete?: (id: string) => void;
  reason?: Reason | null;
  isLoading?: boolean;
}

const ICON_OPTIONS = [
  'ri-award-line',
  'ri-shield-check-line',
  'ri-tools-line',
  'ri-time-line',
  'ri-customer-service-2-line',
  'ri-medal-line',
  'ri-star-line',
  'ri-thumb-up-line',
  'ri-heart-line',
  'ri-checkbox-circle-line',
  'ri-verified-badge-line',
  'ri-trophy-line'
];

export default function ReasonEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  reason,
  isLoading = false
}: ReasonEditModalProps) {
  const [formData, setFormData] = useState<Reason>({
    title: '',
    description: '',
    icon: 'ri-award-line',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (reason) {
      setFormData(reason);
    } else {
      setFormData({
        title: '',
        description: '',
        icon: 'ri-award-line',
        order_index: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [reason, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'L\'icône est requise';
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

  const handleInputChange = (field: keyof Reason, value: string | number | boolean) => {
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

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      onDelete={reason?._id ? () => onDelete?.(reason._id!) : undefined}
      title={reason ? 'Modifier la raison' : 'Ajouter une raison'}
      isLoading={isLoading}
      showDelete={!!reason?._id}
      deleteLabel="Supprimer la raison"
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
            placeholder="ex: Expertise Reconnue"
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
            placeholder="Description de la raison..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icône *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleInputChange('icon', icon)}
                className={`p-3 border-2 rounded-lg text-center transition-colors ${
                  formData.icon === icon
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <i className={`${icon} text-xl`}></i>
              </button>
            ))}
          </div>
          {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
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
