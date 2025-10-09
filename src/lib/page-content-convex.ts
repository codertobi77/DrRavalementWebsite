import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { PageContent, PageSection } from "./convex";

// Hook pour récupérer une page par slug
export function usePageBySlug(slug: string) {
  return useQuery(api.pages.getPageBySlug, { slug });
}

// Hook pour récupérer toutes les pages
export function useAllPages() {
  return useQuery(api.pages.getAllPages);
}

// Hook pour récupérer les sections d'une page
export function usePageSections(pageId: string) {
  return useQuery(api.pages.getPageSections, { pageId: pageId as any });
}

// Hook pour récupérer les sections d'une page (admin)
export function usePageSectionsForAdmin(pageId: string) {
  return useQuery(api.pages.getPageSectionsForAdmin, { pageId: pageId as any });
}

// Hook pour créer une page
export function useCreatePage() {
  return useMutation(api.pages.createPage);
}

// Hook pour mettre à jour une page
export function useUpdatePage() {
  return useMutation(api.pages.updatePage);
}

// Hook pour supprimer une page
export function useDeletePage() {
  return useMutation(api.pages.deletePage);
}

// Hook pour créer une section de page
export function useCreatePageSection() {
  return useMutation(api.pages.createPageSection);
}

// Hook pour mettre à jour une section de page
export function useUpdatePageSection() {
  return useMutation(api.pages.updatePageSection);
}

// Hook pour supprimer une section de page
export function useDeletePageSection() {
  return useMutation(api.pages.deletePageSection);
}

// Hook pour réorganiser les sections
export function useReorderPageSections() {
  return useMutation(api.pages.reorderPageSections);
}

// Service class pour la compatibilité avec l'ancien code
export class PageContentService {
  // Récupérer une page par son slug
  static async getPageBySlug(slug: string): Promise<PageContent | null> {
    // Cette méthode sera utilisée côté serveur ou dans des contextes non-React
    // Pour l'instant, on retourne null car on utilise les hooks React
    console.warn("PageContentService.getPageBySlug should be replaced with usePageBySlug hook");
    return null;
  }

  // Récupérer toutes les sections d'une page
  static async getPageSections(pageId: string): Promise<PageSection[]> {
    console.warn("PageContentService.getPageSections should be replaced with usePageSections hook");
    return [];
  }

  // Récupérer une page complète avec ses sections
  static async getPageWithSections(slug: string): Promise<{
    page: PageContent | null;
    sections: PageSection[];
  }> {
    console.warn("PageContentService.getPageWithSections should be replaced with hooks");
    return { page: null, sections: [] };
  }

  // Mettre à jour le contenu d'une page
  static async updatePageContent(
    pageId: string, 
    updates: Partial<PageContent>
  ): Promise<PageContent | null> {
    console.warn("PageContentService.updatePageContent should be replaced with useUpdatePage hook");
    return null;
  }

  // Mettre à jour une section de page
  static async updatePageSection(
    sectionId: string,
    updates: Partial<PageSection>
  ): Promise<PageSection | null> {
    console.warn("PageContentService.updatePageSection should be replaced with useUpdatePageSection hook");
    return null;
  }

  // Créer une nouvelle section de page
  static async createPageSection(
    pageId: string,
    sectionData: Omit<PageSection, '_id' | 'page_id' | 'created_at' | 'updated_at'>
  ): Promise<PageSection | null> {
    console.warn("PageContentService.createPageSection should be replaced with useCreatePageSection hook");
    return null;
  }

  // Supprimer une section de page
  static async deletePageSection(sectionId: string): Promise<boolean> {
    console.warn("PageContentService.deletePageSection should be replaced with useDeletePageSection hook");
    return false;
  }

  // Récupérer toutes les pages (pour l'admin)
  static async getAllPages(): Promise<PageContent[]> {
    console.warn("PageContentService.getAllPages should be replaced with useAllPages hook");
    return [];
  }

  // Récupérer les sections d'une page (pour l'admin)
  static async getPageSectionsForAdmin(pageId: string): Promise<PageSection[]> {
    console.warn("PageContentService.getPageSectionsForAdmin should be replaced with usePageSectionsForAdmin hook");
    return [];
  }

  // Réorganiser les sections d'une page
  static async reorderPageSections(
    pageId: string,
    sectionOrders: { id: string; order_index: number }[]
  ): Promise<boolean> {
    console.warn("PageContentService.reorderPageSections should be replaced with useReorderPageSections hook");
    return false;
  }
}
