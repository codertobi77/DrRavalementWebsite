import { useServiceManager } from '../../config/services'

export default function ServicesDashboard() {
  const {
    config,
    status,
    loading,
    updateConfig,
    validateConfig,
    getMissingServices,
    getRecommendations,
    getMetrics
  } = useServiceManager()

  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'sms' | 'calendar' | 'seo' | 'settings'>('overview')
  const [showConfigModal, setShowConfigModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  const validation = validateConfig()
  const missingServices = getMissingServices()
  const recommendations = getRecommendations()
  const metrics = getMetrics()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Services</h2>
            <p className="text-gray-600">Configuration et monitoring des services intégrés</p>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <i className="ri-settings-line mr-2"></i>
            Configuration
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Vue d\'ensemble', icon: 'ri-dashboard-line' },
            { id: 'email', name: 'Email', icon: 'ri-mail-line' },
            { id: 'sms', name: 'SMS', icon: 'ri-message-line' },
            { id: 'calendar', name: 'Calendrier', icon: 'ri-calendar-line' },
            { id: 'seo', name: 'SEO', icon: 'ri-search-line' },
            { id: 'settings', name: 'Paramètres', icon: 'ri-settings-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statut des services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    status.email ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <i className={`ri-mail-line text-xl ${status.email ? 'text-green-600' : 'text-red-600'}`}></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Email</div>
                    <div className={`text-sm ${status.email ? 'text-green-600' : 'text-red-600'}`}>
                      {status.email ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    status.sms ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <i className={`ri-message-line text-xl ${status.sms ? 'text-green-600' : 'text-red-600'}`}></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">SMS</div>
                    <div className={`text-sm ${status.sms ? 'text-green-600' : 'text-red-600'}`}>
                      {status.sms ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    status.calendar ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <i className={`ri-calendar-line text-xl ${status.calendar ? 'text-green-600' : 'text-red-600'}`}></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Calendrier</div>
                    <div className={`text-sm ${status.calendar ? 'text-green-600' : 'text-red-600'}`}>
                      {status.calendar ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    status.seo ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <i className={`ri-search-line text-xl ${status.seo ? 'text-green-600' : 'text-red-600'}`}></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">SEO</div>
                    <div className={`text-sm ${status.seo ? 'text-green-600' : 'text-red-600'}`}>
                      {status.seo ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Erreurs de configuration */}
            {!validation.valid && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <i className="ri-error-warning-line text-red-600 mr-2"></i>
                  <h3 className="font-semibold text-red-800">Erreurs de configuration</h3>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Services manquants */}
            {missingServices.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <i className="ri-alert-line text-yellow-600 mr-2"></i>
                  <h3 className="font-semibold text-yellow-800">Services manquants</h3>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {missingServices.map((service, index) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommandations */}
            {recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <i className="ri-information-line text-blue-600 mr-2"></i>
                  <h3 className="font-semibold text-blue-800">Recommandations</h3>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {recommendations.map((recommendation, index) => (
                    <li key={index}>• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Email */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Email</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <div className="text-sm text-gray-600">{config.email.provider}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className={`text-sm ${status.email ? 'text-green-600' : 'text-red-600'}`}>
                    {status.email ? 'Actif' : 'Inactif'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <div className="text-sm text-gray-600">{config.email.fromEmail}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reply To</label>
                  <div className="text-sm text-gray-600">{config.email.replyTo}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SMS */}
        {activeTab === 'sms' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration SMS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <div className="text-sm text-gray-600">{config.sms.provider}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className={`text-sm ${status.sms ? 'text-green-600' : 'text-red-600'}`}>
                    {status.sms ? 'Actif' : 'Inactif'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="text-sm text-gray-600">{config.sms.phoneNumber || 'Non configuré'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Calendrier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <div className="text-sm text-gray-600">{config.calendar.provider}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className={`text-sm ${status.calendar ? 'text-green-600' : 'text-red-600'}`}>
                    {status.calendar ? 'Actif' : 'Inactif'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URI</label>
                  <div className="text-sm text-gray-600">{config.calendar.redirectUri}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <div className="text-sm text-gray-600">{config.seo.siteName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                  <div className="text-sm text-gray-600">{config.seo.siteUrl}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Handle</label>
                  <div className="text-sm text-gray-600">{config.seo.twitterHandle}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className={`text-sm ${status.seo ? 'text-green-600' : 'text-red-600'}`}>
                    {status.seo ? 'Actif' : 'Inactif'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications Email</label>
                    <p className="text-xs text-gray-500">Activer les notifications par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.email}
                    onChange={(e) => updateConfig({
                      notifications: { ...config.notifications, email: e.target.checked }
                    })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications SMS</label>
                    <p className="text-xs text-gray-500">Activer les notifications par SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.sms}
                    onChange={(e) => updateConfig({
                      notifications: { ...config.notifications, sms: e.target.checked }
                    })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications In-App</label>
                    <p className="text-xs text-gray-500">Activer les notifications dans l'application</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.inApp}
                    onChange={(e) => updateConfig({
                      notifications: { ...config.notifications, inApp: e.target.checked }
                    })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
