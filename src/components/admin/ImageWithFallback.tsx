import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackText = 'Image non disponible',
  onError,
  onLoad
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error('Erreur chargement image:', src);
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    console.log('Image chargée avec succès:', src);
    setIsLoading(false);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-sm`}>
        <div className="text-center">
          <i className="ri-image-line text-2xl mb-2 block"></i>
          <span>{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : 'block'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}


