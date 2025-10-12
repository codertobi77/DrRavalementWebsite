// Service d'upload d'images pour le CMS
// Simule un upload en générant une URL locale

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  size?: number;
  type?: string;
  error?: string;
}

export class ImageUploadService {
  private static instance: ImageUploadService;
  
  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  /**
   * Simule l'upload d'une image en générant une URL locale
   * Dans un vrai projet, ceci ferait appel à un service d'upload (AWS S3, Cloudinary, etc.)
   */
  async uploadImage(file: File, type: string): Promise<UploadResult> {
    try {
      // Validation du type de fichier
      if (!this.validateImageType(file)) {
        return {
          success: false,
          error: 'Type de fichier non supporté. Formats acceptés: JPEG, PNG, GIF, WebP'
        };
      }

      // Validation de la taille
      if (!this.validateFileSize(file)) {
        return {
          success: false,
          error: 'Fichier trop volumineux. Taille maximale: 5MB'
        };
      }

      // Générer un nom de fichier unique
      const fileName = this.generateUniqueFileName(file.name, type);
      
      // Créer une URL de données à partir du fichier pour l'affichage
      const dataUrl = await this.createImagePreview(file);
      
      // Vérifier si la data URL est trop volumineuse pour Convex (1MB max)
      if (dataUrl.length > 1024 * 1024) {
        return {
          success: false,
          error: 'Image trop volumineuse. Veuillez choisir une image plus petite (max 1MB)'
        };
      }
      
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        url: dataUrl, // Utiliser l'URL de données pour l'affichage
        fileName: fileName,
        size: file.size,
        type: file.type
      };

    } catch (error) {
      console.error('Erreur upload:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'upload de l\'image'
      };
    }
  }

  /**
   * Valide le type de fichier
   */
  private validateImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Valide la taille du fichier (max 5MB)
   */
  private validateFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateUniqueFileName(originalName: string, type: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop() || 'jpg';
    return `${type}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Crée un aperçu d'image à partir d'un fichier avec compression
   */
  createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions (max 800px de largeur)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Redimensionner le canvas
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir en base64 avec compression JPEG (qualité 0.8)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
      
      // Lire le fichier et charger l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Impossible de lire le fichier'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }
}

// Export de l'instance singleton
export const imageUploadService = ImageUploadService.getInstance();
