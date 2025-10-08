
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useAuth } from '../../lib/auth';
import { ProjectService } from '../../lib/projects';
import { QuoteService } from '../../lib/quotes';
import { BookingService } from '../../lib/quotes';

interface ClientProject {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  documents: Document[];
  timeline: TimelineEvent[];
  nextSteps: string[];
  team: TeamMember[];
  photos: ProjectPhoto[];
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'photo' | 'plan' | 'certificate';
  date: string;
  url: string;
  size: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'update' | 'issue' | 'completion';
  photos?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface ProjectPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  category: 'before' | 'progress' | 'after';
}

export default function ClientDashboard() {
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'invoices' | 'team' | 'photos'>('overview');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { user, loading: authLoading, signIn, signOut } = useAuth();

  // Charger les projets du client
  useEffect(() => {
    if (user?.id) {
      loadClientProjects();
    }
  }, [user]);

  const loadClientProjects = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const clientProjects = await ProjectService.getClientProjects(user.id);
      // Convertir les projets Supabase vers le format ClientProject
      const formattedProjects = clientProjects.map(project => ({
        id: project.id,
        clientName: user.first_name + ' ' + user.last_name,
        projectTitle: project.title,
        status: project.status as 'planning' | 'in-progress' | 'completed' | 'on-hold',
        progress: project.progress,
        startDate: project.start_date,
        endDate: project.end_date,
        budget: project.budget,
        nextSteps: [], // À implémenter
        team: [], // À implémenter
        photos: [], // À implémenter
        documents: [], // À implémenter
        timeline: [] // À implémenter
      }));
      setProjects(formattedProjects);
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion réelle
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(loginForm.email, loginForm.password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setProjects([]);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Mock data - in real app, this would come from API
  const projects: ClientProject[] = [
    {
      id: '1',
      clientName: 'Jean Dupont',
      projectTitle: 'Ravalement Façade Maison Principale',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-02-28',
      budget: 15000,
      nextSteps: [
        'Application de la couche de finition',
        'Nettoyage final du chantier',
        'Réception des travaux'
      ],
      team: [
        { id: '1', name: 'Marc Dubois', role: 'Chef de chantier', phone: '06 12 34 56 78', email: 'marc@dr-ravalement.fr' },
        { id: '2', name: 'Pierre Martin', role: 'Façadier', phone: '06 23 45 67 89', email: 'pierre@dr-ravalement.fr' }
      ],
      photos: [
        { id: '1', url: 'https://readdy.ai/api/search-image?query=construction%20site%20preparation%2C%20scaffolding%20installation%2C%20house%20facade%20renovation%20beginning%2C%20professional%20workers%2C%20realistic%20photography%2C%20natural%20lighting&width=400&height=300&seq=photo1&orientation=landscape', caption: 'Installation du chantier', date: '2024-01-15', category: 'before' },
        { id: '2', url: 'https://readdy.ai/api/search-image?query=facade%20cleaning%20in%20progress%2C%20high%20pressure%20washing%2C%20renovation%20work%2C%20construction%20workers%2C%20realistic%20photography%2C%20natural%20lighting&width=400&height=300&seq=photo2&orientation=landscape', caption: 'Nettoyage en cours', date: '2024-01-22', category: 'progress' }
      ],
      documents: [
        { id: '1', name: 'Contrat de travaux', type: 'contract', date: '2024-01-10', url: '#', size: '2.3 MB' },
        { id: '2', name: 'Facture acompte', type: 'invoice', date: '2024-01-15', url: '#', size: '156 KB' },
        { id: '3', name: 'Photos avant travaux', type: 'photo', date: '2024-01-15', url: '#', size: '8.7 MB' },
        { id: '4', name: 'Plan technique', type: 'plan', date: '2024-01-12', url: '#', size: '1.2 MB' },
        { id: '5', name: 'Certificat assurance', type: 'certificate', date: '2024-01-10', url: '#', size: '890 KB' }
      ],
      timeline: [
        { 
          id: '1', 
          date: '2024-01-15', 
          title: 'Début des travaux', 
          description: 'Installation du chantier et préparation des surfaces', 
          type: 'milestone',
          photos: ['https://readdy.ai/api/search-image?query=construction%20site%20setup%2C%20scaffolding%2C%20safety%20equipment%2C%20professional%20renovation%20start%2C%20realistic%20photography&width=300&height=200&seq=timeline1&orientation=landscape']
        },
        { 
          id: '2', 
          date: '2024-01-22', 
          title: 'Nettoyage façade', 
          description: 'Nettoyage haute pression terminé sur toute la surface', 
          type: 'completion',
          photos: ['https://readdy.ai/api/search-image?query=facade%20high%20pressure%20cleaning%20completed%2C%20clean%20walls%2C%20renovation%20progress%2C%20professional%20work%2C%20realistic%20photography&width=300&height=200&seq=timeline2&orientation=landscape']
        },
        { 
          id: '3', 
          date: '2024-01-28', 
          title: 'Réparations mineures', 
          description: 'Rebouchage des fissures et préparation des surfaces', 
          type: 'update' 
        },
        { 
          id: '4', 
          date: '2024-02-05', 
          title: 'Application sous-couche', 
          description: 'Première couche d\'apprêt appliquée', 
          type: 'completion' 
        }
      ]
    },
    {
      id: '2',
      clientName: 'Marie Leroy',
      projectTitle: 'Isolation Thermique Extérieure',
      status: 'planning',
      progress: 15,
      startDate: '2024-03-01',
      endDate: '2024-03-20',
      budget: 12000,
      nextSteps: [
        'Finalisation des plans',
        'Commande des matériaux',
        'Début des travaux'
      ],
      team: [
        { id: '3', name: 'Antoine Rousseau', role: 'Chef de projet', phone: '06 34 56 78 90', email: 'antoine@dr-ravalement.fr' }
      ],
      photos: [],
      documents: [
        { id: '6', name: 'Devis détaillé', type: 'contract', date: '2024-02-15', url: '#', size: '1.8 MB' }
      ],
      timeline: [
        { id: '5', date: '2024-02-15', title: 'Signature du devis', description: 'Validation du projet et signature', type: 'milestone' }
      ]
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'planning': return 'Planifié';
      case 'on-hold': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return 'ri-file-text-line';
      case 'invoice': return 'ri-bill-line';
      case 'photo': return 'ri-image-line';
      case 'plan': return 'ri-draft-line';
      case 'certificate': return 'ri-award-line';
      default: return 'ri-file-line';
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'milestone': return 'ri-flag-line';
      case 'completion': return 'ri-check-line';
      case 'update': return 'ri-information-line';
      case 'issue': return 'ri-alert-line';
      default: return 'ri-circle-line';
    }
  };

  // Afficher le loading pendant l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-2xl text-orange-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Connexion Espace Client
                </h1>
                <p className="text-gray-600">
                  Accédez au suivi de vos projets
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ? 
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                    className="text-orange-600 hover:text-orange-700 ml-1"
                  >
                    Contactez-nous
                  </button>
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-2"></i>
                  Pour tester : utilisez n'importe quel email et mot de passe
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Espace Client
              </h1>
              <p className="text-gray-600">
                Suivez l'avancement de vos projets en temps réel
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Déconnexion
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Project Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mes Projets
                </h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedProject === project.id
                          ? 'bg-orange-50 border-2 border-orange-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">
                        {project.projectTitle}
                      </h3>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions rapides</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                    >
                      <i className="ri-message-line mr-3 text-orange-600"></i>
                      Contacter l'équipe
                    </button>
                    <button
                      onClick={() => window.REACT_APP_NAVIGATE('/quote-calculator')}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                    >
                      <i className="ri-calculator-line mr-3 text-orange-600"></i>
                      Nouveau devis
                    </button>
                    <button
                      onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                    >
                      <i className="ri-customer-service-line mr-3 text-orange-600"></i>
                      Assistant IA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Project Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentProject.projectTitle}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Client: {currentProject.clientName}</span>
                      <span>•</span>
                      <span>Budget: {currentProject.budget.toLocaleString('fr-FR')}€</span>
                    </div>
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                    {getStatusText(currentProject.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Avancement</span>
                    <span className="text-sm font-medium text-orange-600">{currentProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Date de début</span>
                    <div className="font-medium">
                      {new Date(currentProject.startDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Date de fin prévue</span>
                    <div className="font-medium">
                      {new Date(currentProject.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6 overflow-x-auto">
                    {[
                      { id: 'overview', name: 'Vue d\'ensemble', icon: 'ri-dashboard-line' },
                      { id: 'timeline', name: 'Chronologie', icon: 'ri-time-line' },
                      { id: 'photos', name: 'Photos', icon: 'ri-camera-line' },
                      { id: 'documents', name: 'Documents', icon: 'ri-folder-line' },
                      { id: 'team', name: 'Équipe', icon: 'ri-team-line' },
                      { id: 'invoices', name: 'Factures', icon: 'ri-bill-line' }
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

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-xl p-6">
                          <div className="flex items-center">
                            <i className="ri-calendar-line text-2xl text-blue-600 mr-3"></i>
                            <div>
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.max(0, Math.ceil((new Date(currentProject.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                              </div>
                              <div className="text-sm text-gray-600">Jours restants</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6">
                          <div className="flex items-center">
                            <i className="ri-check-line text-2xl text-green-600 mr-3"></i>
                            <div>
                              <div className="text-2xl font-bold text-green-600">{currentProject.progress}%</div>
                              <div className="text-sm text-gray-600">Terminé</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6">
                          <div className="flex items-center">
                            <i className="ri-team-line text-2xl text-orange-600 mr-3"></i>
                            <div>
                              <div className="text-2xl font-bold text-orange-600">{currentProject.team.length}</div>
                              <div className="text-sm text-gray-600">Intervenants</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-lg mb-4">Prochaines étapes</h3>
                        <div className="space-y-3">
                          {currentProject.nextSteps.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <i className={`${index === 0 ? 'ri-circle-fill text-orange-600' : 'ri-circle-line text-gray-400'} mr-3`}></i>
                              <span className={index === 0 ? 'font-medium' : ''}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weather Alert */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center">
                          <i className="ri-sun-cloudy-line text-yellow-600 mr-3"></i>
                          <div>
                            <h4 className="font-medium text-yellow-800">Conditions météo</h4>
                            <p className="text-sm text-yellow-700">Conditions favorables prévues pour les 3 prochains jours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Tab */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-6">
                      {currentProject.timeline.map((event, index) => (
                        <div key={event.id} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <i className={`${getTimelineIcon(event.type)} text-orange-600`}></i>
                            </div>
                            {index < currentProject.timeline.length - 1 && (
                              <div className="w-px h-16 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(event.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{event.description}</p>
                            {event.photos && event.photos.length > 0 && (
                              <div className="flex space-x-2">
                                {event.photos.map((photo, photoIndex) => (
                                  <img
                                    key={photoIndex}
                                    src={photo}
                                    alt={`Photo ${event.title}`}
                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Photos Tab */}
                  {activeTab === 'photos' && (
                    <div className="space-y-6">
                      {currentProject.photos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentProject.photos.map((photo) => (
                            <div key={photo.id} className="bg-gray-50 rounded-xl overflow-hidden">
                              <img
                                src={photo.url}
                                alt={photo.caption}
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4">
                                <h4 className="font-medium mb-1">{photo.caption}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(photo.date).toLocaleDateString('fr-FR')}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                  photo.category === 'before' ? 'bg-red-100 text-red-800' :
                                  photo.category === 'progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {photo.category === 'before' ? 'Avant' : 
                                   photo.category === 'progress' ? 'En cours' : 'Après'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <i className="ri-camera-line text-4xl text-gray-400 mb-4"></i>
                          <p className="text-gray-600">Aucune photo disponible pour le moment</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      {currentProject.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center">
                            <i className={`${getDocumentIcon(doc.type)} text-2xl text-orange-600 mr-4`}></i>
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(doc.date).toLocaleDateString('fr-FR')} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <button className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                            <i className="ri-download-line mr-1"></i>
                            Télécharger
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Team Tab */}
                  {activeTab === 'team' && (
                    <div className="space-y-4">
                      {currentProject.team.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                              <i className="ri-user-line text-orange-600"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={`tel:${member.phone}`}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <i className="ri-phone-line"></i>
                            </a>
                            <a
                              href={`mailto:${member.email}`}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <i className="ri-mail-line"></i>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Invoices Tab */}
                  {activeTab === 'invoices' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium">Facture d'acompte</h4>
                          <p className="text-sm text-gray-600">30% - Payée le 15/01/2024</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">4 500€</div>
                          <span className="text-sm text-green-600 flex items-center">
                            <i className="ri-check-line mr-1"></i>
                            Payée
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium">Facture intermédiaire</h4>
                          <p className="text-sm text-gray-600">40% - À payer avant le 10/02/2024</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">6 000€</div>
                          <span className="text-sm text-orange-600 flex items-center">
                            <i className="ri-time-line mr-1"></i>
                            En attente
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium">Facture de solde</h4>
                          <p className="text-sm text-gray-600">30% - À la réception des travaux</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">4 500€</div>
                          <span className="text-sm text-gray-400 flex items-center">
                            <i className="ri-calendar-line mr-1"></i>
                            À venir
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
