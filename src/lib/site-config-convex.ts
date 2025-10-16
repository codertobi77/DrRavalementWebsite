import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { SiteConfig } from "./convex";

// Hook pour récupérer une configuration par clé
export function useConfigByKey(key: string) {
  return useQuery(api.siteConfig.getConfigByKey, { key });
}

// Hook pour récupérer toutes les configurations publiques
export function usePublicConfigs() {
  return useQuery(api.siteConfig.getPublicConfigs);
}

// Hook pour récupérer toutes les configurations (admin)
export function useAllConfigs() {
  return useQuery(api.siteConfig.getAllConfigs);
}

// Hook pour récupérer les configurations par catégorie
export function useConfigsByCategory(category: string) {
  return useQuery(api.siteConfig.getConfigsByCategory, { category });
}

// Hook pour créer/mettre à jour une configuration
export function useSetConfig() {
  return useMutation(api.siteConfig.setConfig);
}

// Hook pour supprimer une configuration
export function useDeleteConfig() {
  return useMutation(api.siteConfig.deleteConfig);
}

// Hook pour initialiser les configurations par défaut
export function useInitializeDefaultConfigs() {
  return useMutation(api.siteConfig.initializeDefaultConfigs);
}

// Service class pour la compatibilité avec l'ancien code
export interface BookingConfig {
  maxAdvanceDays: number;
  workingDays: { start: number; end: number };
  maxBookingsPerDay: number;
  services: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export interface ContactConfig {
  email: string;
  phone: string;
  address: string;
  hours: string;
  // Informations juridiques
  legalForm?: string;
  creationDate?: string;
  fullAddress?: string;
  siren?: string;
  apeCode?: string;
  vatNumber?: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

export interface AppearanceConfig {
  siteName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export class SiteConfigService {
  // Récupérer la configuration des réservations
  static async getBookingConfig(): Promise<BookingConfig | null> {
    console.warn("SiteConfigService.getBookingConfig should be replaced with useConfigByKey hook");
    return null;
  }

  // Récupérer la configuration de contact
  static async getContactConfig(): Promise<ContactConfig | null> {
    console.warn("SiteConfigService.getContactConfig should be replaced with useConfigByKey hook");
    return null;
  }

  // Récupérer la configuration des emails
  static async getEmailConfig(): Promise<EmailConfig | null> {
    console.warn("SiteConfigService.getEmailConfig should be replaced with useConfigByKey hook");
    return null;
  }

  // Récupérer la configuration de l'apparence
  static async getAppearanceConfig(): Promise<AppearanceConfig | null> {
    console.warn("SiteConfigService.getAppearanceConfig should be replaced with useConfigByKey hook");
    return null;
  }

  // Mettre à jour la configuration des réservations
  static async updateBookingConfig(config: BookingConfig): Promise<boolean> {
    console.warn("SiteConfigService.updateBookingConfig should be replaced with useSetConfig hook");
    return false;
  }

  // Mettre à jour la configuration de contact
  static async updateContactConfig(config: ContactConfig): Promise<boolean> {
    console.warn("SiteConfigService.updateContactConfig should be replaced with useSetConfig hook");
    return false;
  }

  // Mettre à jour la configuration des emails
  static async updateEmailConfig(config: EmailConfig): Promise<boolean> {
    console.warn("SiteConfigService.updateEmailConfig should be replaced with useSetConfig hook");
    return false;
  }

  // Mettre à jour la configuration de l'apparence
  static async updateAppearanceConfig(config: AppearanceConfig): Promise<boolean> {
    console.warn("SiteConfigService.updateAppearanceConfig should be replaced with useSetConfig hook");
    return false;
  }
}
