import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel.d.ts';
import FormattedContent from './FormattedContent';

interface ArticleModalProps {
  articleId: Id<"articles"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleModal({ articleId, isOpen, onClose }: ArticleModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer l'article complet
  const article = useQuery(
    api.articles.getArticleById, 
    articleId ? { id: articleId } : "skip"
  );

  // Mutation pour incrémenter les vues
  const incrementViews = useMutation(api.articles.incrementViews);

  // Incrémenter les vues quand l'article est chargé
  useEffect(() => {
    if (article && articleId) {
      incrementViews({ id: articleId });
    }
  }, [article, articleId, incrementViews]);

  // Fermer le modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Ne pas rendre si pas ouvert
  if (!isOpen || !articleId) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {article?.category}
              </span>
              <span className="text-gray-500 text-sm">
                {article?.published_at ? formatDate(article.published_at) : 'Non publié'}
              </span>
              <span className="text-gray-500 text-sm">
                {article?.read_time} min de lecture
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : article ? (
              <div className="p-6">
                {/* Image principale */}
                {article.featured_image && (
                  <div className="mb-8">
                    <img 
                      src={article.featured_image} 
                      alt={article.title}
                      className="w-full h-64 md:h-80 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Titre */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
                    <p className="text-lg text-gray-700 italic">
                      {article.excerpt}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Contenu */}
                <FormattedContent 
                  content={article.content}
                  className="prose prose-lg max-w-none"
                />

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <i className="ri-eye-line mr-1"></i>
                        {article.view_count} vues
                      </span>
                      <span className="flex items-center">
                        <i className="ri-time-line mr-1"></i>
                        {article.read_time} min de lecture
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        <i className="ri-share-line mr-2"></i>
                        Partager
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <i className="ri-heart-line mr-2"></i>
                        J'aime
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Article non trouvé</h3>
                  <p className="text-gray-600">Cet article n'existe pas ou a été supprimé.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
