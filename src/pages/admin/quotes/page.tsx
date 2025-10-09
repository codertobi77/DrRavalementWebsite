import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

interface Quote {
  _id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  service_type: string;
  description: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  items?: QuoteItem[];
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function QuoteManagement() {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Hooks Convex
  const allQuotes = useQuery(api.quotes.getAllQuotes);
  const quotesByStatus = useQuery(
    api.quotes.getQuotesByStatus,
    filter !== 'all' ? { status: filter } : "skip"
  );

  // Mutations
  const createQuote = useMutation(api.quotes.createQuote);
  const updateQuote = useMutation(api.quotes.updateQuote);
  const deleteQuote = useMutation(api.quotes.deleteQuote);

  // Utiliser les données filtrées ou toutes les devis
  const quotes = filter === 'all' ? allQuotes : quotesByStatus;
  const loading = quotes === undefined;

  const updateQuoteStatus = async (quoteId: string, status: Quote['status']) => {
    try {
      await updateQuote({ id: quoteId as any, status });
      setSelectedQuote(null);
    } catch (error) {
      console.error('Error updating quote status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const sendQuote = async (quoteId: string) => {
    try {
      // TODO: Implémenter l'envoi réel par email
      console.log('Sending quote:', quoteId);
      updateQuoteStatus(quoteId, 'sent');
    } catch (error) {
      console.error('Error sending quote:', error);
      setError('Erreur lors de l\'envoi du devis');
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Refusé';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredQuotes = quotes.filter(quote => 
    filter === 'all' || quote.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
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
                  Gestion des devis
                </h1>
                <p className="text-gray-600">
                  Créez, envoyez et suivez vos devis clients
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

          {/* Messages d'erreur */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            </div>
          )}

          {/* Barre d'outils */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Nouveau devis
                </Button>
                <Button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="ri-download-line mr-2"></i>
                  Exporter
                </Button>
              </div>

              {/* Filtres */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous ({quotes.length})</option>
                    <option value="draft">Brouillons ({quotes.filter(q => q.status === 'draft').length})</option>
                    <option value="sent">Envoyés ({quotes.filter(q => q.status === 'sent').length})</option>
                    <option value="accepted">Acceptés ({quotes.filter(q => q.status === 'accepted').length})</option>
                    <option value="rejected">Refusés ({quotes.filter(q => q.status === 'rejected').length})</option>
                    <option value="expired">Expirés ({quotes.filter(q => q.status === 'expired').length})</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des devis */}
          <div className="space-y-4">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun devis trouvé
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Commencez par créer votre premier devis'
                    : `Aucun devis avec le statut "${getStatusLabel(filter as any)}"`
                  }
                </p>
              </div>
            ) : (
              filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  onView={() => setSelectedQuote(quote)}
                  onUpdateStatus={updateQuoteStatus}
                  onSend={sendQuote}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                  formatCurrency={formatCurrency}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedQuote && (
        <QuoteDetailsModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdateStatus={updateQuoteStatus}
          onSend={sendQuote}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          formatCurrency={formatCurrency}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Composant pour la carte de devis
function QuoteCard({ 
  quote, 
  onView, 
  onUpdateStatus, 
  onSend, 
  getStatusColor, 
  getStatusLabel, 
  formatCurrency 
}: {
  quote: Quote;
  onView: () => void;
  onUpdateStatus: (id: string, status: Quote['status']) => void;
  onSend: (id: string) => void;
  getStatusColor: (status: Quote['status']) => string;
  getStatusLabel: (status: Quote['status']) => string;
  formatCurrency: (amount: number) => string;
}) {
  const isExpired = new Date(quote.valid_until) < new Date();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Devis #{quote._id}
              </h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                {getStatusLabel(quote.status)}
              </span>
              {isExpired && quote.status !== 'accepted' && quote.status !== 'rejected' && (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                  Expiré
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium text-gray-900">{quote.client_name}</p>
                <p className="text-sm text-gray-500">{quote.client_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium text-gray-900">{quote.service_type}</p>
                <p className="text-sm text-gray-500">{quote.address}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{quote.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <i className="ri-money-euro-circle-line mr-2"></i>
                  {formatCurrency(quote.amount)}
                </span>
                <span className="flex items-center">
                  <i className="ri-calendar-line mr-2"></i>
                  Valide jusqu'au {new Date(quote.valid_until).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center">
                  <i className="ri-time-line mr-2"></i>
                  Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
            >
              <i className="ri-eye-line"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <i className="ri-edit-line"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
              <i className="ri-file-download-line"></i>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {quote.status === 'draft' && (
              <Button
                onClick={() => onSend(quote._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <i className="ri-send-plane-line mr-1"></i>
                Envoyer
              </Button>
            )}
            {quote.status === 'sent' && (
              <>
                <Button
                  onClick={() => onUpdateStatus(quote._id, 'accepted')}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <i className="ri-check-line mr-1"></i>
                  Accepter
                </Button>
                <Button
                  onClick={() => onUpdateStatus(quote._id, 'rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <i className="ri-close-line mr-1"></i>
                  Refuser
                </Button>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Dernière modification: {new Date(quote.updated_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de détails du devis
function QuoteDetailsModal({ 
  quote, 
  onClose, 
  onUpdateStatus, 
  onSend, 
  getStatusColor, 
  getStatusLabel, 
  formatCurrency 
}: {
  quote: Quote;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Quote['status']) => void;
  onSend: (id: string) => void;
  getStatusColor: (status: Quote['status']) => string;
  getStatusLabel: (status: Quote['status']) => string;
  formatCurrency: (amount: number) => string;
}) {
  const isExpired = new Date(quote.valid_until) < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Devis #{quote._id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* En-tête du devis */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{quote.service_type}</h4>
              <p className="text-gray-600">{quote.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(quote.amount)}</div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                {getStatusLabel(quote.status)}
              </span>
              {isExpired && quote.status !== 'accepted' && quote.status !== 'rejected' && (
                <span className="block mt-1 text-sm text-red-600">Expiré</span>
              )}
            </div>
          </div>

          {/* Informations client */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Informations client</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <p className="text-sm text-gray-900">{quote.client_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{quote.client_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <p className="text-sm text-gray-900">{quote.client_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <p className="text-sm text-gray-900">{quote.address}</p>
              </div>
            </div>
          </div>

          {/* Détails du devis */}
          {quote.items && quote.items.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Détails du devis</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total HT
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {formatCurrency(quote.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Dates */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Dates importantes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de création</label>
                <p className="text-sm text-gray-900">
                  {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valide jusqu'au</label>
                <p className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(quote.valid_until).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {quote.status === 'draft' && (
              <Button
                onClick={() => onSend(quote._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="ri-send-plane-line mr-2"></i>
                Envoyer le devis
              </Button>
            )}
            {quote.status === 'sent' && (
              <>
                <Button
                  onClick={() => onUpdateStatus(quote._id, 'accepted')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="ri-check-line mr-2"></i>
                  Marquer comme accepté
                </Button>
                <Button
                  onClick={() => onUpdateStatus(quote._id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="ri-close-line mr-2"></i>
                  Marquer comme refusé
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
