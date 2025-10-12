import React, { useState, useRef } from 'react';
import { imageUploadService } from '../../lib/upload-image';

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  label,
  placeholder = "https://example.com/image.jpg",
  error,
  required = false,
  className = ""
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(typeof value === 'string' ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await imageUploadService.uploadImage(file);
      onChange(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  // Mettre à jour la preview quand value change
  React.useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      
      {/* Aperçu de l'image */}
      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-32 object-cover rounded-lg border border-gray-300"
            onError={() => setPreview('')}
          />
        </div>
      )}

      {/* Bouton d'upload */}
      <div className="flex space-x-2 mb-3">
        <button
          type="button"
          onClick={triggerFileUpload}
          disabled={isUploading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Upload en cours...
            </>
          ) : (
            <>
              <i className="ri-upload-line mr-2"></i>
              Uploader une image
            </>
          )}
        </button>
        
        <span className="text-sm text-gray-500 self-center">ou</span>
      </div>

      {/* Champ URL */}
      <input
        type="url"
        value={value}
        onChange={(e) => handleUrlChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      
      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      <p className="text-xs text-gray-500 mt-1">
        Formats acceptés: JPG, PNG, GIF, WebP. Taille max: 5MB
      </p>
    </div>
  );
}
