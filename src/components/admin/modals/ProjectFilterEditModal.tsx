import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface ProjectFilter {
  _id?: string;
  key: string;
  label: string;
  order_index: number;
  is_active: boolean;
}

interface ProjectFilterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFilter) => void;
  onDelete?: (id: string) => void;
  filter?: ProjectFilter | null;
  isLoading?: boolean;
}

const PREDEFINED_FILTERS = [
  { key: 'tous', label: 'Tous les Projets' },
  { key: 'ravalement', label: 'Ravalement' },
  { key: 'maconnerie', label: 'Maçonnerie' },
  { key: 'couverture', label: 'Couverture' },
  { key: 'renovation', label: 'Rénovation' },
  { key: 'isolation', label: 'Isolation' },
  { key: 'peinture', label: 'Peinture' },
  { key: 'enduit', label: 'Enduit' }
];

export default function ProjectFilterEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  filter,
  isLoading = false
}: ProjectFilterEditModalProps) {
  const [formData, setFormData] = useState<ProjectFilter>({
    key: '',
    label: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usePredefined, setUsePredefined] = useState(false);

  useEffect(() => {
    if (filter) {
      setFormData(filter);
      setUsePredefined(PREDEFINED_FILTERS.some(p => p.key === filter.key));
    } else {
      setFormData({
        key: '',
        label: '',
        order_index: 0,
        is_active: true
      });
      setUsePredefined(false);
    }
    setErrors({});
  }, [filter, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = 'La clé est requise';
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

  const handleInputChange = (field: keyof ProjectFilter, value: string | number | boolean) => {
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

  const handlePredefinedSelect = (predefined: { key: string; label: string }) => {
    setFormData(prev => ({
      ...prev,
      key: predefined.key,
      label: predefined.label
    }));
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      onDelete={filter?._id ? () => onDelete?.(filter._id!) : undefined}
      title={filter ? 'Modifier le filtre' : 'Ajouter un filtre'}
      isLoading={isLoading}
      showDelete={!!filter?._id}
      deleteLabel="Supprimer le filtre"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de filtre
          </label>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={usePredefined}
                onChange={() => setUsePredefined(true)}
                className="mr-2"
              />
              Prédefini
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!usePredefined}
                onChange={() => setUsePredefined(false)}
                className="mr-2"
              />
              Personnalisé
            </label>
          </div>

          {usePredefined ? (
            <div className="grid grid-cols-2 gap-2">
              {PREDEFINED_FILTERS.map((predefined) => (
                <button
                  key={predefined.key}
                  type="button"
                  onClick={() => handlePredefinedSelect(predefined)}
                  className={`p-3 border-2 rounded-lg text-left transition-colors ${
                    formData.key === predefined.key
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-medium">{predefined.label}</div>
                  <div className="text-sm text-gray-500">{predefined.key}</div>
                </button>
              ))}
            </div>
          ) : (
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
                  placeholder="ex: renovation"
                />
                {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key}</p>}
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
                  placeholder="ex: Rénovation"
                />
                {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
              </div>
            </div>
          )}
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
