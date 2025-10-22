import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel.d.ts';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import ConfirmationModal from '../../../components/base/ConfirmationModal';
import { useOptimizedAdminArticles, useOptimizedAdminArticleStats } from '../../../hooks/useOptimizedCmsData';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirmation } from '../../../hooks/useConfirmation';

export default function AdminArticles() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Id<"articles"> | null>(null);

  // Hooks pour les toasters et confirmations
  const { showSuccess, showError, showWarning } = useToast();
  const { isOpen, isLoading, options, confirm, handleConfirm, handleCancel } = useConfirmation();

  // Utiliser les hooks optimisés avec cache
  const { data: articles, isLoading: articlesLoading, refresh: refreshArticles } = useOptimizedAdminArticles();
  const { data: stats, isLoading: statsLoading, refresh: refreshStats } = useOptimizedAdminArticleStats();
  
  // Récupérer les catégories directement depuis Convex
  const categories = useQuery(api.articles.getArticleCategories);

  // Mutations
  const deleteArticle = useMutation(api.articles.deleteArticle);
  const publishArticle = useMutation(api.articles.publishArticle);
  const unpublishArticle = useMutation(api.articles.unpublishArticle);

  // Filtrer les articles par terme de recherche et statut/catégorie
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  const handleDelete = async (id: Id<"articles">) => {
    const article = articles?.find(a => a._id === id);
    confirm({
      title: 'Supprimer l\'article',
      message: `Êtes-vous sûr de vouloir supprimer l'article "${article?.title || 'cet article'}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteArticle({ id });
          refreshArticles();
          refreshStats();
          showSuccess('Article supprimé', 'L\'article a été supprimé avec succès.');
        } catch (error) {
          showError('Erreur de suppression', 'Impossible de supprimer l\'article.');
        }
      },
    });
  };
  const handlePublish = async (id: Id<"articles">) => {
    try {
      await publishArticle({ id });
      refreshArticles();
      refreshStats();
      showSuccess('Article publié', 'L\'article a été publié avec succès.');
    } catch (error) {
      showError('Erreur de publication', 'Impossible de publier l\'article.');
    }
  };

  const handleUnpublish = async (id: Id<"articles">) => {
    const article = articles?.find(a => a._id === id);
    confirm({
      title: 'Dépublier l\'article',
      message: `Êtes-vous sûr de vouloir dépublier l'article "${article?.title || 'cet article'}" ? Il ne sera plus visible sur le site.`,
      confirmText: 'Dépublier',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: async () => {
        try {
          await unpublishArticle({ id });
          refreshArticles();
          refreshStats();
          showWarning('Article dépublié', 'L\'article n\'est plus visible sur le site.');
        } catch (error) {
          showError('Erreur de dépublication', 'Impossible de dépublier l\'article.');
        }
      },
    });
  };
  // Fonction pour ouvrir le modal de création
  const handleCreateClick = () => {
    setEditingArticle(null);
    setShowCreateModal(true);
  };

  // Fonction pour ouvrir le modal d'édition
  const handleEditClick = (articleId: Id<"articles">) => {
    setEditingArticle(articleId);
    setShowCreateModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // État de chargement global
  const isPageLoading = articlesLoading || statsLoading || !categories;

  if (isPageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Articles</h1>
            <p className="text-gray-600 mt-2">Créez et gérez les articles de votre blog</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                refreshArticles();
                refreshStats();
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir
            </Button>
            <Button
              onClick={handleCreateClick}
            >
              <i className="ri-add-line mr-2"></i>
              Nouvel Article
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-article-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="ri-eye-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.published || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="ri-draft-line text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.draft || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="ri-star-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vues Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalViews || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Titre, contenu, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="all">Toutes les catégories</option>
                {categories?.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Articles ({filteredArticles.length})
            </h3>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <i className="ri-article-line text-4xl sm:text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Aucun article ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier article.'}
              </p>
              <Button onClick={handleCreateClick} className="text-sm sm:text-base">
                <i className="ri-add-line mr-2"></i>
                Créer un Article
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                          {article.title}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {article.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <i className="ri-star-fill mr-1"></i>
                              À la une
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="ri-folder-line mr-1"></i>
                          {article.category}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {article.read_time} min
                        </span>
                        <span className="flex items-center">
                          <i className="ri-eye-line mr-1"></i>
                          {article.view_count} vues
                        </span>
                        {article.published_at && (
                          <span className="flex items-center">
                            <i className="ri-calendar-line mr-1"></i>
                            {formatDate(article.published_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(article._id)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-base sm:text-lg"></i>
                      </button>

                      {article.status === 'published' ? (
                        <button
                          onClick={() => handleUnpublish(article._id)}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Dépublier"
                        >
                          <i className="ri-eye-off-line text-base sm:text-lg"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(article._id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Publier"
                        >
                          <i className="ri-eye-line text-base sm:text-lg"></i>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(article._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-base sm:text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de création/édition */}
      {showCreateModal && (
        <ArticleModal
          articleId={editingArticle}
          onClose={() => {
            setShowCreateModal(false);
            setEditingArticle(null);
          }}
          categories={categories}
        />
      )}

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

// Composant Modal pour créer/éditer un article
function ArticleModal({ 
  articleId, 
  onClose, 
  categories 
}: { 
  articleId?: Id<"articles">; 
  onClose: () => void; 
  categories: string[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    is_featured: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks pour les toasters
  const { showSuccess, showError } = useToast();

  const article = useQuery(
    api.articles.getArticleById,
    articleId ? { id: articleId } : "skip"
  );

  const createArticle = useMutation(api.articles.createArticle);
  const updateArticle = useMutation(api.articles.updateArticle);

  // Charger les données de l'article si on est en mode édition
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        featured_image: article.featured_image,
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        category: article.category,
        tags: article.tags,
        status: article.status,
        is_featured: article.is_featured,
      });
    } else if (!articleId) {
      // Réinitialiser le formulaire pour la création
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        category: categories?.[0] || 'Conseils',
        tags: [],
        status: 'draft',
        is_featured: false,
      });
    }
  }, [article, articleId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (articleId) {
        await updateArticle({
          id: articleId,
          ...formData,
        });
        showSuccess('Article modifié', 'L\'article a été modifié avec succès.');
      } else {
        await createArticle(formData);
        showSuccess('Article créé', 'L\'article a été créé avec succès.');
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError('Erreur de sauvegarde', 'Impossible de sauvegarder l\'article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {articleId ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories?.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extrait *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Résumé de l'article qui apparaîtra dans la liste..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Saisissez le contenu de votre article avec les outils de formatage..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image mise en avant *
            </label>
            <input
              type="url"
              required
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="URL de l'image..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre SEO
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Titre pour les moteurs de recherche..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description SEO
              </label>
              <input
                type="text"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Description pour les moteurs de recherche..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-orange-100 text-orange-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 sm:ml-2 text-orange-600 hover:text-orange-800"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Ajouter un tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Article à la une</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {articleId ? 'Mise à jour...' : 'Création...'}
                </div>
              ) : (
                articleId ? 'Mettre à jour' : 'Créer l\'article'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
