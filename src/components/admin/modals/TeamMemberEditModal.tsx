import { useState, useEffect, useRef } from 'react';
import EditModal from './EditModal';
import { imageUploadService } from '../../../lib/upload-image';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  order_index: number;
  is_active: boolean;
}

interface TeamMemberEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamMember) => void;
  onDelete?: (id: string) => void;
  member?: TeamMember | null;
  isLoading?: boolean;
}

export default function TeamMemberEditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  member,
  isLoading = false
}: TeamMemberEditModalProps) {
  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    role: '',
    description: '',
    image: '',
    order_index: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setFormData(member);
      setImagePreview(member.image);
    } else {
      setFormData({
        name: '',
        role: '',
        description: '',
        image: '',
        order_index: 0,
        is_active: true
      });
      setImagePreview('');
    }
    setErrors({});
  }, [member, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Le rôle est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
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

  const handleInputChange = (field: keyof TeamMember, value: string | number | boolean) => {
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

  const handleImageUrlChange = (url: string) => {
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
      const result = await imageUploadService.uploadImage(file, 'equipe');
      
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
      onDelete={member?._id ? () => onDelete?.(member._id!) : undefined}
      title={member ? 'Modifier le membre' : 'Ajouter un membre'}
      isLoading={isLoading}
      showDelete={!!member?._id}
      deleteLabel="Supprimer le membre"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ex: Jean Dupont"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            placeholder="ex: Directeur Technique"
          />
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
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
            placeholder="Description du membre..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
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
            placeholder="https://example.com/photo.jpg"
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
