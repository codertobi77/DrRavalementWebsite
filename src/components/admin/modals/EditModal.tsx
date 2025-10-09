import { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  showDelete?: boolean;
  deleteLabel?: string;
}

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  title,
  children,
  isLoading = false,
  showDelete = false,
  deleteLabel = "Supprimer"
}: EditModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (onDelete && window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setIsDeleting(true);
      try {
        await onDelete();
        onClose();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full max-w-sm mx-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-lg sm:text-xl"></i>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {children}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:flex-row-reverse gap-2 sm:gap-0">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-sm sm:text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </button>
            
            {showDelete && onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Suppression...
                  </>
                ) : (
                  <>
                    <i className="ri-delete-bin-line mr-2"></i>
                    {deleteLabel}
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
