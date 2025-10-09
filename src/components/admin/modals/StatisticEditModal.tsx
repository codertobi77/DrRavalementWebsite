import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface Statistic {
  _id?: string;
  key: string;
  value: string;
  label: string;
  order_index: number;
  is_active: boolean;
}

interface StatisticEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Statistic) => void;
  onDelete?: (id: string) => void;
  statistic?: Statistic | null;
  isLoading?: boolean;
}

export default function StatisticEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  statistic,
  isLoading = false
}: StatisticEditModalProps) {
  const [formData, setFormData] = useState<Statistic>({
    key: '',
    value: '',
    label: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (statistic) {
      setFormData(statistic);
    } else {
      setFormData({
        key: '',
        value: '',
        label: '',
        order_index: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [statistic, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = 'La clé est requise';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'La valeur est requise';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Le libellé est requis';
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

  const handleInputChange = (field: keyof Statistic, value: string | number | boolean) => {
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
      onDelete={statistic?._id ? () => onDelete?.(statistic._id!) : undefined}
      title={statistic ? 'Modifier la statistique' : 'Ajouter une statistique'}
      isLoading={isLoading}
      showDelete={!!statistic?._id}
      deleteLabel="Supprimer la statistique"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clé *
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => handleInputChange('key', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.key ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: facades_renovees"
          />
          {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valeur *
          </label>
          <input
            type="text"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.value ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: 500+"
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Libellé *
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.label ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Façades Rénovées"
          />
          {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
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
