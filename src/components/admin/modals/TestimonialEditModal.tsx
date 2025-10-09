import { useState, useEffect } from 'react';
import EditModal from './EditModal';

interface Testimonial {
  _id?: string;
  text: string;
  author: string;
  role: string;
  project: string;
  image: string;
  order_index: number;
  is_active: boolean;
}

interface TestimonialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Testimonial) => void;
  onDelete?: (id: string) => void;
  testimonial?: Testimonial | null;
  isLoading?: boolean;
}

export default function TestimonialEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  testimonial,
  isLoading = false
}: TestimonialEditModalProps) {
  const [formData, setFormData] = useState<Testimonial>({
    text: '',
    author: '',
    role: '',
    project: '',
    image: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        text: '',
        author: '',
        role: '',
        project: '',
        image: '',
        order_index: 0,
        is_active: true
      });
    }
    setErrors({});
  }, [testimonial, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Le texte du témoignage est requis';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Le nom de l\'auteur est requis';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Le rôle est requis';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Le projet est requis';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'L\'image est requise';
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

  const handleInputChange = (field: keyof Testimonial, value: string | number | boolean) => {
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
      onDelete={testimonial?._id ? () => onDelete?.(testimonial._id!) : undefined}
      title={testimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}
      isLoading={isLoading}
      showDelete={!!testimonial?._id}
      deleteLabel="Supprimer le témoignage"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texte du témoignage *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.text ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Texte du témoignage..."
          />
          {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'auteur *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ex: Jean Dupont"
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ex: Propriétaire"
            />
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Projet *
          </label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.project ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Ravalement façade - Paris 15ème"
          />
          {errors.project && <p className="text-red-500 text-sm mt-1">{errors.project}</p>}
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
            placeholder="https://example.com/photo.jpg"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
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
