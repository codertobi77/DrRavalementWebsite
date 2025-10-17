import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

interface ArticleQuickActionsProps {
  className?: string;
}

export default function ArticleQuickActions({ className = "" }: ArticleQuickActionsProps) {
  const articleStats = useQuery(api.articles.getArticleStats);

  if (!articleStats) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Articles & Blog
      </h3>
      
      <div className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {articleStats.total}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {articleStats.published}
            </div>
            <div className="text-xs text-gray-500">Publiés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {articleStats.draft}
            </div>
            <div className="text-xs text-gray-500">Brouillons</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/admin/articles"
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3 group-hover:bg-orange-200 transition-colors">
                <i className="ri-article-line"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Gérer les articles</p>
                <p className="text-xs text-gray-500">Créer, modifier, publier</p>
              </div>
            </div>
            <i className="ri-arrow-right-line text-gray-400 group-hover:text-orange-600"></i>
          </a>

          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                <i className="ri-external-link-line"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Voir le blog</p>
                <p className="text-xs text-gray-500">Aperçu public</p>
              </div>
            </div>
            <i className="ri-arrow-right-line text-gray-400 group-hover:text-blue-600"></i>
          </a>
        </div>

        {/* Lien vers la création rapide */}
        <div className="pt-3 border-t border-gray-100">
          <a
            href="/admin/articles?action=create"
            className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Nouvel article
          </a>
        </div>
      </div>
    </div>
  );
}
