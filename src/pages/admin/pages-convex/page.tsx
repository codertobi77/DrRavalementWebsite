import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function PageManagementConvex() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<any>(null);

  // Hooks Convex
  const pages = useQuery(api.pages.getAllPages);
  const sections = useQuery(
    api.pages.getPageSectionsForAdmin, 
    selectedPage ? { pageId: selectedPage as any } : "skip"
  );

  // Mutations
  const createPage = useMutation(api.pages.createPage);
  const updatePage = useMutation(api.pages.updatePage);
  const deletePage = useMutation(api.pages.deletePage);
  const createPageSection = useMutation(api.pages.createPageSection);
  const updatePageSection = useMutation(api.pages.updatePageSection);
  const deletePageSection = useMutation(api.pages.deletePageSection);

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
  };

  const handleSectionUpdate = async (sectionId: string, updates: any) => {
    try {
      await updatePageSection({ id: sectionId as any, ...updates });
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleSectionCreate = async (sectionData: any) => {
    if (!selectedPage) return;

    try {
      await createPageSection({
        page_id: selectedPage as any,
        ...sectionData
      });
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleSectionDelete = async (sectionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) return;

    try {
      await deletePageSection({ id: sectionId as any });
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const getPageTitle = (slug: string) => {
    const titles: Record<string, string> = {
      'home': 'Page d\'accueil',
      'about': 'À propos',
      'services': 'Services',
      'portfolio': 'Réalisations'
    };
    return titles[slug] || slug;
  };

  // Loading state
  if (pages === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion des pages (Convex)
                </h1>
                <p className="text-gray-600">
                  Modifiez le contenu de vos pages principales avec Convex
                </p>
              </div>
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Retour au tableau de bord
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des pages */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pages du site
                </h3>
                <div className="space-y-3">
                  {pages.map((page) => (
                    <button
                      key={page._id}
                      onClick={() => handlePageSelect(page._id)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedPage === page._id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {getPageTitle(page.slug)}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{page.slug}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu de la page sélectionnée */}
            <div className="lg:col-span-2">
              {selectedPage ? (
                <div className="space-y-6">
                  {/* Informations de la page */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getPageTitle(pages.find(p => p._id === selectedPage)?.slug || '')}
                      </h3>
                      <Button
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <i className="ri-edit-line mr-2"></i>
                        Modifier la page
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Titre SEO</label>
                        <p className="text-sm text-gray-900">
                          {pages.find(p => p._id === selectedPage)?.meta_title || 'Non défini'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description SEO</label>
                        <p className="text-sm text-gray-900">
                          {pages.find(p => p._id === selectedPage)?.meta_description || 'Non définie'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sections de la page */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sections de la page
                      </h3>
                      <Button
                        onClick={() => setEditingSection({
                          section_key: '',
                          section_type: 'text',
                          title: '',
                          content: {},
                          order_index: sections?.length || 0,
                          is_active: true
                        })}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Nouvelle section
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {sections?.map((section) => (
                        <SectionCard
                          key={section._id}
                          section={section}
                          onEdit={() => setEditingSection(section)}
                          onDelete={() => handleSectionDelete(section._id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <i className="ri-file-text-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sélectionnez une page
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une page dans la liste pour voir et modifier son contenu
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'édition de section */}
      {editingSection && (
        <SectionEditModal
          section={editingSection}
          onSave={handleSectionUpdate}
          onCreate={handleSectionCreate}
          onClose={() => setEditingSection(null)}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Composant pour afficher une section
function SectionCard({ 
  section, 
  onEdit, 
  onDelete 
}: {
  section: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getSectionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'hero': 'Section Hero',
      'text': 'Texte',
      'services': 'Services',
      'testimonials': 'Témoignages',
      'gallery': 'Galerie',
      'image': 'Image'
    };
    return types[type] || type;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-medium text-gray-900">
              {section.title || section.section_key}
            </h4>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {getSectionTypeLabel(section.section_type)}
            </span>
            <span className="text-sm text-gray-500">
              Ordre: {section.order_index}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Clé: {section.section_key}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal d'édition de section
function SectionEditModal({ 
  section, 
  onSave, 
  onCreate, 
  onClose 
}: {
  section: any;
  onSave: (id: string, updates: any) => void;
  onCreate: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    section_key: section.section_key || '',
    section_type: section.section_type || 'text',
    title: section.title || '',
    content: JSON.stringify(section.content || {}, null, 2),
    order_index: section.order_index || 0,
    is_active: section.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updates = {
        ...formData,
        content: JSON.parse(formData.content)
      };

      if (section._id) {
        onSave(section._id, updates);
      } else {
        onCreate(updates);
      }
    } catch (error) {
      console.error('Error parsing JSON content:', error);
      alert('Erreur dans le format JSON du contenu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {section._id ? 'Modifier la section' : 'Nouvelle section'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clé de section
              </label>
              <input
                type="text"
                value={formData.section_key}
                onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de section
              </label>
              <select
                value={formData.section_type}
                onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="hero">Hero</option>
                <option value="text">Texte</option>
                <option value="services">Services</option>
                <option value="testimonials">Témoignages</option>
                <option value="gallery">Galerie</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu (JSON)
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordre
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Section active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              {section._id ? 'Sauvegarder' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
