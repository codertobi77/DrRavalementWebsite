import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { BookingConfig, ContactConfig, EmailConfig } from '../../../lib/site-config-convex';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function ConfigManagement() {
  const [activeSection, setActiveSection] = useState<string>('booking');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // États pour chaque configuration
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);
  const [contactConfig, setContactConfig] = useState<ContactConfig | null>(null);
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);

  const configSections: ConfigSection[] = [
    {
      id: 'booking',
      title: 'Réservations',
      description: 'Services, créneaux et horaires de travail',
      icon: 'ri-calendar-line',
      color: 'bg-blue-500'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Informations de l\'entreprise et réseaux sociaux',
      icon: 'ri-phone-line',
      color: 'bg-green-500'
    },
    {
      id: 'email',
      title: 'Emails',
      description: 'Templates et configuration des notifications',
      icon: 'ri-mail-line',
      color: 'bg-purple-500'
    },
    {
      id: 'appearance',
      title: 'Apparence',
      description: 'Couleurs, logos et thème du site',
      icon: 'ri-palette-line',
      color: 'bg-pink-500'
    }
  ];


  // Hooks Convex pour charger les configurations
  const bookingConfigData = useQuery(api.siteConfig.getConfigByKey, { key: "booking_config" });
  const contactConfigData = useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" });
  const emailConfigData = useQuery(api.siteConfig.getConfigByKey, { key: "email_config" });

  // Mutations pour sauvegarder
  const updateBookingConfig = useMutation(api.siteConfig.setConfig);
  const updateContactConfig = useMutation(api.siteConfig.setConfig);
  const updateEmailConfig = useMutation(api.siteConfig.setConfig);

  // Effet pour charger les configurations
  useEffect(() => {
    if (bookingConfigData !== undefined && contactConfigData !== undefined && emailConfigData !== undefined) {
      setBookingConfig(bookingConfigData as BookingConfig);
      setContactConfig(contactConfigData as ContactConfig);
      setEmailConfig(emailConfigData as EmailConfig);
      setLoading(false);
    }
  }, [bookingConfigData, contactConfigData, emailConfigData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Sauvegarder la configuration active
      switch (activeSection) {
        case 'booking':
          if (bookingConfig) {
            await updateBookingConfig({ 
              key: 'booking_config', 
              value: bookingConfig,
              description: 'Configuration des réservations et créneaux',
              category: 'booking',
              is_public: true
            });
          }
          break;
        case 'contact':
          if (contactConfig) {
            await updateContactConfig({ 
              key: 'contact_config', 
              value: contactConfig,
              description: 'Informations de contact de l\'entreprise',
              category: 'contact',
              is_public: true
            });
          }
          break;
        case 'email':
          if (emailConfig) {
            await updateEmailConfig({ 
              key: 'email_config', 
              value: emailConfig,
              description: 'Configuration des emails et notifications',
              category: 'email',
              is_public: true
            });
          }
          break;
      }

      setSuccess('Configuration sauvegardée avec succès !');
    } catch (error) {
      console.error('Error saving configuration:', error);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (!bookingConfig) return;
    
    const newService = {
      id: `service_${Date.now()}`,
      name: 'Nouveau service',
      duration: 60,
      description: 'Description du service'
    };
    
    setBookingConfig({
      ...bookingConfig,
      services: [...bookingConfig.services, newService]
    });
  };

  const removeService = (index: number) => {
    if (!bookingConfig) return;
    
    setBookingConfig({
      ...bookingConfig,
      services: bookingConfig.services.filter((_, i) => i !== index)
    });
  };

  const updateService = (index: number, field: string, value: any) => {
    if (!bookingConfig) return;
    
    const updatedServices = [...bookingConfig.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    
    setBookingConfig({
      ...bookingConfig,
      services: updatedServices
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="h-96 bg-gray-300 rounded"></div>
                </div>
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
                  Configuration du site
                </h1>
                <p className="text-gray-600">
                  Modifiez les paramètres et le contenu de votre site web
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

          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="ri-check-circle-line mr-2"></i>
                {success}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Menu latéral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sections
                </h3>
                <nav className="space-y-2">
                  {configSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 ${section.color} rounded-lg mr-3`}>
                        <i className={`${section.icon} text-white text-sm`}></i>
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow">
                {/* En-tête de la section */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 ${configSections.find(s => s.id === activeSection)?.color} rounded-lg mr-3`}>
                        <i className={`${configSections.find(s => s.id === activeSection)?.icon} text-white`}></i>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {configSections.find(s => s.id === activeSection)?.title}
                        </h2>
                        <p className="text-gray-600">
                          {configSections.find(s => s.id === activeSection)?.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>
                </div>

                {/* Contenu de la section */}
                <div className="p-6">
                  {activeSection === 'booking' && bookingConfig && (
                    <BookingConfigForm 
                      config={bookingConfig} 
                      onChange={setBookingConfig}
                      onAddService={addService}
                      onRemoveService={removeService}
                      onUpdateService={updateService}
                    />
                  )}

                  {activeSection === 'contact' && contactConfig && (
                    <ContactConfigForm 
                      config={contactConfig} 
                      onChange={setContactConfig}
                    />
                  )}

                  {activeSection === 'email' && emailConfig && (
                    <EmailConfigForm 
                      config={emailConfig} 
                      onChange={setEmailConfig}
                    />
                  )}

                  {activeSection === 'appearance' && (
                    <AppearanceConfigForm />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Composant pour la configuration des réservations
function BookingConfigForm({ 
  config, 
  onChange, 
  onAddService, 
  onRemoveService, 
  onUpdateService 
}: {
  config: BookingConfig;
  onChange: (config: BookingConfig) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (index: number, field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Services proposés</h3>
          <Button
            onClick={onAddService}
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Ajouter un service
          </Button>
        </div>
        
        <div className="space-y-4">
          {config.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du service
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => onUpdateService(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => onRemoveService(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={service.description || ''}
                  onChange={(e) => onUpdateService(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Description du service"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limite de réservations par jour */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Limite de réservations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre maximum de réservations par jour
            </label>
            <input
              type="number"
              value={config.maxBookingsPerDay || 5}
              onChange={(e) => onChange({ ...config, maxBookingsPerDay: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="1"
              max="20"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre maximum de réservations acceptées par jour
            </p>
          </div>
        </div>
      </div>

      {/* Jours de travail */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Jours de travail</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jour de début (0=Dimanche, 1=Lundi...)
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={config.workingDays.start}
              onChange={(e) => onChange({
                ...config,
                workingDays: { ...config.workingDays, start: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jour de fin
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={config.workingDays.end}
              onChange={(e) => onChange({
                ...config,
                workingDays: { ...config.workingDays, end: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la configuration des contacts
function ContactConfigForm({ config, onChange }: { config: ContactConfig; onChange: (config: ContactConfig) => void }) {
  return (
    <div className="space-y-8">
      {/* Informations de contact de base */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={config.email}
              onChange={(e) => onChange({ ...config, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={config.phone}
              onChange={(e) => onChange({ ...config, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse (zone de service)
            </label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => onChange({ ...config, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Seine-et-Marne & Île-de-France"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horaires d'ouverture
            </label>
            <input
              type="text"
              value={config.hours}
              onChange={(e) => onChange({ ...config, hours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Lun-Ven: 8h-18h | Sam: 9h-12h"
            />
          </div>
        </div>
      </div>

      {/* Informations juridiques */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Juridiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forme juridique
            </label>
            <select
              value={config.legalForm || ''}
              onChange={(e) => onChange({ ...config, legalForm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="SARL">SARL</option>
              <option value="SAS">SAS</option>
              <option value="EURL">EURL</option>
              <option value="SASU">SASU</option>
              <option value="Auto-entrepreneur">Auto-entrepreneur</option>
              <option value="Micro-entreprise">Micro-entreprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de création
            </label>
            <input
              type="date"
              value={config.creationDate || ''}
              onChange={(e) => onChange({ ...config, creationDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse complète du siège social
            </label>
            <input
              type="text"
              value={config.fullAddress || ''}
              onChange={(e) => onChange({ ...config, fullAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: 123 Rue de la Maçonnerie, 77000 Melun, France"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SIREN
            </label>
            <input
              type="text"
              value={config.siren || ''}
              onChange={(e) => onChange({ ...config, siren: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: 123456789"
              maxLength={9}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code APE
            </label>
            <input
              type="text"
              value={config.apeCode || ''}
              onChange={(e) => onChange({ ...config, apeCode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: 4391A"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de TVA intracommunautaire
            </label>
            <input
              type="text"
              value={config.vatNumber || ''}
              onChange={(e) => onChange({ ...config, vatNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: FR12345678901"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la configuration des emails
function EmailConfigForm({ config, onChange }: { config: EmailConfig; onChange: (config: EmailConfig) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email du propriétaire
          </label>
          <input
            type="email"
            value={config.ownerEmail}
            onChange={(e) => onChange({ ...config, ownerEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'expéditeur
          </label>
          <input
            type="text"
            value={config.fromName}
            onChange={(e) => onChange({ ...config, fromName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email d'expéditeur
          </label>
          <input
            type="email"
            value={config.fromEmail}
            onChange={(e) => onChange({ ...config, fromEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email de réponse
          </label>
          <input
            type="email"
            value={config.replyTo}
            onChange={(e) => onChange({ ...config, replyTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

// Composant pour la configuration de l'apparence
function AppearanceConfigForm() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <i className="ri-palette-line text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuration de l'apparence
        </h3>
        <p className="text-gray-600">
          Cette section sera disponible prochainement
        </p>
      </div>
    </div>
  );
}
