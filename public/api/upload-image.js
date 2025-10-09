// API d'upload d'images pour le CMS
// Ce fichier doit être déplacé vers le backend dans un vrai projet

const fs = require('fs');
const path = require('path');

// Fonction pour créer les dossiers s'ils n'existent pas
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Fonction pour générer un nom de fichier unique
function generateUniqueFileName(originalName, type) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  return `${type}_${timestamp}_${randomString}${extension}`;
}

// Fonction pour valider le type de fichier
function validateImageType(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
}

// Fonction pour valider la taille du fichier (max 5MB)
function validateFileSize(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}

// Fonction principale d'upload
async function uploadImage(file, type) {
  try {
    // Validation
    if (!validateImageType(file)) {
      throw new Error('Type de fichier non supporté. Formats acceptés: JPEG, PNG, GIF, WebP');
    }

    if (!validateFileSize(file)) {
      throw new Error('Fichier trop volumineux. Taille maximale: 5MB');
    }

    // Créer le dossier de destination
    const uploadDir = path.join(process.cwd(), 'public', 'assets', type);
    ensureDirectoryExists(uploadDir);

    // Générer un nom de fichier unique
    const fileName = generateUniqueFileName(file.name, type);
    const filePath = path.join(uploadDir, fileName);

    // Sauvegarder le fichier
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Retourner l'URL publique
    const publicUrl = `/assets/${type}/${fileName}`;
    
    return {
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    };

  } catch (error) {
    console.error('Erreur upload:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export pour utilisation dans le backend
module.exports = {
  uploadImage,
  ensureDirectoryExists,
  generateUniqueFileName,
  validateImageType,
  validateFileSize
};
