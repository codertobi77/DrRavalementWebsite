import { supabase } from './supabase';

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  content: Record<string, any>;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  title?: string;
  content: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class PageContentService {
  // Récupérer une page par son slug
  static async getPageBySlug(slug: string): Promise<PageContent | null> {
    try {
      const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        return null;
      }

      return page;
    } catch (error) {
      console.error('Error in getPageBySlug:', error);
      return null;
    }
  }

  // Récupérer toutes les sections d'une page
  static async getPageSections(pageId: string): Promise<PageSection[]> {
    try {
      const { data: sections, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching page sections:', error);
        return [];
      }

      return sections || [];
    } catch (error) {
      console.error('Error in getPageSections:', error);
      return [];
    }
  }

  // Récupérer une page complète avec ses sections
  static async getPageWithSections(slug: string): Promise<{
    page: PageContent | null;
    sections: PageSection[];
  }> {
    try {
      const page = await this.getPageBySlug(slug);
      if (!page) {
        return { page: null, sections: [] };
      }

      const sections = await this.getPageSections(page.id);
      return { page, sections };
    } catch (error) {
      console.error('Error in getPageWithSections:', error);
      return { page: null, sections: [] };
    }
  }

  // Mettre à jour le contenu d'une page
  static async updatePageContent(
    pageId: string, 
    updates: Partial<PageContent>
  ): Promise<PageContent | null> {
    try {
      const { data: page, error } = await supabase
        .from('pages')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .select()
        .single();

      if (error) {
        console.error('Error updating page content:', error);
        return null;
      }

      return page;
    } catch (error) {
      console.error('Error in updatePageContent:', error);
      return null;
    }
  }

  // Mettre à jour une section de page
  static async updatePageSection(
    sectionId: string,
    updates: Partial<PageSection>
  ): Promise<PageSection | null> {
    try {
      const { data: section, error } = await supabase
        .from('page_sections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sectionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating page section:', error);
        return null;
      }

      return section;
    } catch (error) {
      console.error('Error in updatePageSection:', error);
      return null;
    }
  }

  // Créer une nouvelle section de page
  static async createPageSection(
    pageId: string,
    sectionData: Omit<PageSection, 'id' | 'page_id' | 'created_at' | 'updated_at'>
  ): Promise<PageSection | null> {
    try {
      const { data: section, error } = await supabase
        .from('page_sections')
        .insert({
          page_id: pageId,
          ...sectionData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating page section:', error);
        return null;
      }

      return section;
    } catch (error) {
      console.error('Error in createPageSection:', error);
      return null;
    }
  }

  // Supprimer une section de page
  static async deletePageSection(sectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId);

      if (error) {
        console.error('Error deleting page section:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePageSection:', error);
      return false;
    }
  }

  // Récupérer toutes les pages (pour l'admin)
  static async getAllPages(): Promise<PageContent[]> {
    try {
      const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching all pages:', error);
        return [];
      }

      return pages || [];
    } catch (error) {
      console.error('Error in getAllPages:', error);
      return [];
    }
  }

  // Récupérer les sections d'une page (pour l'admin)
  static async getPageSectionsForAdmin(pageId: string): Promise<PageSection[]> {
    try {
      const { data: sections, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching page sections for admin:', error);
        return [];
      }

      return sections || [];
    } catch (error) {
      console.error('Error in getPageSectionsForAdmin:', error);
      return [];
    }
  }

  // Réorganiser les sections d'une page
  static async reorderPageSections(
    pageId: string,
    sectionOrders: { id: string; order_index: number }[]
  ): Promise<boolean> {
    try {
      const updates = sectionOrders.map(({ id, order_index }) =>
        supabase
          .from('page_sections')
          .update({ order_index })
          .eq('id', id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error in reorderPageSections:', error);
      return false;
    }
  }
}
