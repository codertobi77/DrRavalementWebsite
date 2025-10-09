import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface Zone {
  _id?: string;
  name: string;
  order_index: number;
  is_active: boolean;
}

interface ZoneEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Zone) => void;
  onDelete?: (id: string) => void;
  zone?: Zone | null;
  isLoading?: boolean;
}

export default function ZoneEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  zone,
  isLoading = false
}: ZoneEditModalProps) {
  const [formData, setFormData] = useState<Zone>({
    name: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zone) {
      setFormData(zone);
    } else {
      setFormData({
        name: '',
        order_index: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [zone, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la zone est requis';
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

  const handleInputChange = (field: keyof Zone, value: string | number | boolean) => {
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
      onDelete={zone?._id ? () => onDelete?.(zone._id!) : undefined}
      title={zone ? 'Modifier la zone' : 'Ajouter une zone'}
      isLoading={isLoading}
      showDelete={!!zone?._id}
      deleteLabel="Supprimer la zone"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la zone *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Paris 1er"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
