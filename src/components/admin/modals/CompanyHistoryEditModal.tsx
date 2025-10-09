import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface CompanyHistory {
  _id?: string;
  title: string;
  paragraphs: string[];
  statistics: Array<{
    value: string;
    label: string;
  }>;
  image: string;
  is_active: boolean;
}

interface CompanyHistoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompanyHistory) => void;
  history?: CompanyHistory | null;
  isLoading?: boolean;
}

export default function CompanyHistoryEditModal({
  isOpen,
  onClose,
  onSave,
  history,
  isLoading = false
}: CompanyHistoryEditModalProps) {
  const [formData, setFormData] = useState<CompanyHistory>({
    title: '',
    paragraphs: [''],
    statistics: [{ value: '', label: '' }],
    image: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newParagraph, setNewParagraph] = useState('');
  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');

  useEffect(() => {
    if (history) {
      setFormData(history);
    } else {
      setFormData({
        title: '',
        paragraphs: [''],
        statistics: [{ value: '', label: '' }],
        image: '',
        is_active: true
      });
    }
    setErrors({});
    setNewParagraph('');
    setNewStatValue('');
    setNewStatLabel('');
  }, [history, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (formData.paragraphs.length === 0 || formData.paragraphs.every(p => !p.trim())) {
      newErrors.paragraphs = 'Au moins un paragraphe est requis';
    }

    if (formData.statistics.length === 0 || formData.statistics.some(s => !s.value.trim() || !s.label.trim())) {
      newErrors.statistics = 'Au moins une statistique valide est requise';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'L\'image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof CompanyHistory, value: string | boolean | string[] | Array<{value: string; label: string}>) => {
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

  const addParagraph = () => {
    if (newParagraph.trim()) {
      handleInputChange('paragraphs', [...formData.paragraphs, newParagraph.trim()]);
      setNewParagraph('');
    }
  };

  const removeParagraph = (index: number) => {
    const newParagraphs = formData.paragraphs.filter((_, i) => i !== index);
    handleInputChange('paragraphs', newParagraphs);
  };

  const addStatistic = () => {
    if (newStatValue.trim() && newStatLabel.trim()) {
      handleInputChange('statistics', [...formData.statistics, { value: newStatValue.trim(), label: newStatLabel.trim() }]);
      setNewStatValue('');
      setNewStatLabel('');
    }
  };

  const removeStatistic = (index: number) => {
    const newStatistics = formData.statistics.filter((_, i) => i !== index);
    handleInputChange('statistics', newStatistics);
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Modifier l'histoire de l'entreprise"
      isLoading={isLoading}
      showDelete={false}
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
            placeholder="ex: Notre Histoire"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paragraphes *
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <textarea
                value={newParagraph}
                onChange={(e) => setNewParagraph(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParagraph()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ajouter un paragraphe..."
                rows={2}
              />
              <button
                type="button"
                onClick={addParagraph}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
            
            {formData.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex items-start space-x-2 bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600 flex-1">{paragraph}</span>
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>
          {errors.paragraphs && <p className="text-red-500 text-sm mt-1">{errors.paragraphs}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statistiques *
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Valeur (ex: 15+)"
              />
              <input
                type="text"
                value={newStatLabel}
                onChange={(e) => setNewStatLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Libellé (ex: Années d'expérience)"
              />
              <button
                type="button"
                onClick={addStatistic}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
            
            {formData.statistics.map((stat, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600 flex-1">
                  <strong>{stat.value}</strong> - {stat.label}
                </span>
                <button
                  type="button"
                  onClick={() => removeStatistic(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>
          {errors.statistics && <p className="text-red-500 text-sm mt-1">{errors.statistics}</p>}
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
            placeholder="https://example.com/history.jpg"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
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
