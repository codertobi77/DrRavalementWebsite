import { supabase, type Article, type Page } from './supabase'

export class CMSService {
  // ARTICLES
  // Obtenir tous les articles
  static async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir les articles publiés
  static async getPublishedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir un article par ID
  static async getArticle(articleId: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      return null
    }
    return data
  }

  // Créer un nouvel article
  static async createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Mettre à jour un article
  static async updateArticle(articleId: string, updates: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', articleId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Supprimer un article
  static async deleteArticle(articleId: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    if (error) throw error
  }

  // Obtenir les articles par catégorie
  static async getArticlesByCategory(category: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // PAGES
  // Obtenir toutes les pages
  static async getPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir les pages publiées
  static async getPublishedPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir une page par slug
  static async getPageBySlug(slug: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching page:', error)
      return null
    }
    return data
  }

  // Obtenir une page par ID
  static async getPage(pageId: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (error) {
      console.error('Error fetching page:', error)
      return null
    }
    return data
  }

  // Créer une nouvelle page
  static async createPage(pageData: Omit<Page, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('pages')
      .insert(pageData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Mettre à jour une page
  static async updatePage(pageId: string, updates: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', pageId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Supprimer une page
  static async deletePage(pageId: string) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)

    if (error) throw error
  }

  // STATISTIQUES
  // Obtenir les statistiques du CMS
  static async getCMSStats() {
    const [articles, pages, publishedArticles, publishedPages] = await Promise.all([
      this.getArticles(),
      this.getPages(),
      this.getPublishedArticles(),
      this.getPublishedPages()
    ])

    return {
      totalArticles: articles.length,
      totalPages: pages.length,
      publishedArticles: publishedArticles.length,
      publishedPages: publishedPages.length,
      draftArticles: articles.length - publishedArticles.length,
      draftPages: pages.length - publishedPages.length
    }
  }
}
