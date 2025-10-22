import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import ConfirmationModal from '../../../components/base/ConfirmationModal';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { ContactConfig, EmailConfig } from '../../../lib/site-config-convex';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirmation } from '../../../hooks/useConfirmation';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function ConfigManagement() {
  const [activeSection, setActiveSection] = useState<string>('contact');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hooks pour les toasters et confirmations
  const { showSuccess, showError } = useToast();
  const { isOpen, isLoading, options, handleConfirm, handleCancel } = useConfirmation();

  // États pour chaque configuration
  const [contactConfig, setContactConfig] = useState<ContactConfig | null>(null);
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);

  const configSections: ConfigSection[] = [

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
  const contactConfigData = useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" });
  const emailConfigData = useQuery(api.siteConfig.getConfigByKey, { key: "email_config" });

  // Mutations pour sauvegarder
  const updateContactConfig = useMutation(api.siteConfig.setConfig);
  const updateEmailConfig = useMutation(api.siteConfig.setConfig);

  // Effet pour charger les configurations
  useEffect(() => {
    if (contactConfigData !== undefined && emailConfigData !== undefined) {
      setContactConfig(contactConfigData as ContactConfig);
      setEmailConfig(emailConfigData as EmailConfig);
      setLoading(false);
    }
  }, [contactConfigData, emailConfigData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Sauvegarder la configuration active
      switch (activeSection) {
        
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

      showSuccess('Configuration sauvegardée', 'Les paramètres ont été sauvegardés avec succès.');
    } catch (error) {
      console.error('Error saving configuration:', error);
      showError('Erreur de sauvegarde', 'Impossible de sauvegarder la configuration.');
    } finally {
      setSaving(false);
    }
  };

  


  if (loading) {
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
            <h1 className="text-3xl font-bold text-gray-900">Configuration du Site</h1>
            <p className="text-gray-600 mt-2">Modifiez les paramètres et le contenu de votre site web</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>


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
              </div>

              {/* Contenu de la section */}
              <div className="p-6">
                

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