import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

interface User {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  name?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  avatar?: string;
}

export default function UserManagement() {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Hooks Convex
  const allUsers = useQuery(api.users.getAllUsers);
  const usersByRole = useQuery(
    api.users.getUsersByRole,
    filter !== 'all' ? { role: filter } : "skip"
  );
  const usersByStatus = useQuery(
    api.users.getUsersByStatus,
    statusFilter !== 'all' ? { status: statusFilter } : "skip"
  );

  // Mutations
  const createUserMutation = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUserMutation = useMutation(api.users.deleteUser);

  // Utiliser les données filtrées
  const users = filter !== 'all' ? usersByRole : statusFilter !== 'all' ? usersByStatus : allUsers;
  const loading = users === undefined;

  // Type assertion pour les données Convex
  const typedUsers = (users ?? []) as User[];

  const updateUserRole = async (userId: Id<"users">, role: User['role']) => {
    try {
      await updateUser({ id: userId, role });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const updateUserStatus = async (userId: Id<"users">, status: User['status']) => {
    try {
      await updateUser({ id: userId, status });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteUserHandler = async (userId: Id<"users">) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await deleteUserMutation({ id: userId });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'editor': return 'Éditeur';
      case 'viewer': return 'Consultant';
      default: return role;
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const filteredUsers = typedUsers.filter(user => 
    (filter === 'all' || user.role === filter) &&
    (statusFilter === 'all' || user.status === statusFilter)
  );

  const createUserHandler = async (userData: { name: string; email: string; role: User['role']; status: User['status'] }) => {
    try {
      await createUserMutation({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

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
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
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
                  Gestion des utilisateurs
                </h1>
                <p className="text-gray-600">
                  Gérez les accès et permissions des utilisateurs
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
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Nouvel utilisateur
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
                  <span className="text-sm text-gray-600">Rôle:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous ({typedUsers.length})</option>
                    <option value="admin">Administrateurs ({typedUsers.filter(u => u.role === 'admin').length})</option>
                    <option value="editor">Éditeurs ({typedUsers.filter(u => u.role === 'editor').length})</option>
                    <option value="viewer">Consultants ({typedUsers.filter(u => u.role === 'viewer').length})</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Statut:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="active">Actifs ({typedUsers.filter(u => u.status === 'active').length})</option>
                    <option value="inactive">Inactifs ({typedUsers.filter(u => u.status === 'inactive').length})</option>
                    <option value="pending">En attente ({typedUsers.filter(u => u.status === 'pending').length})</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-user-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun utilisateur trouvé
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' && statusFilter === 'all'
                    ? 'Commencez par ajouter votre premier utilisateur'
                    : 'Aucun utilisateur ne correspond aux filtres sélectionnés'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onView={() => setSelectedUser(user)}
                        onUpdateRole={updateUserRole}
                        onUpdateStatus={updateUserStatus}
                        onDelete={deleteUserHandler}
                        getRoleColor={getRoleColor}
                        getRoleLabel={getRoleLabel}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdateRole={updateUserRole}
          onUpdateStatus={updateUserStatus}
          onDelete={deleteUserHandler}
          getRoleColor={getRoleColor}
          getRoleLabel={getRoleLabel}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createUserHandler}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Composant pour une ligne d'utilisateur
function UserRow({ 
  user, 
  onView, 
  onDelete, 
  getRoleColor, 
  getRoleLabel, 
  getStatusColor, 
  getStatusLabel 
}: {
  user: User;
  onView: () => void;
  onUpdateRole: (id: Id<"users">, role: User['role']) => void;
  onUpdateStatus: (id: Id<"users">, status: User['status']) => void;
  onDelete: (id: Id<"users">) => void;
  getRoleColor: (role: User['role']) => string;
  getRoleLabel: (role: User['role']) => string;
  getStatusColor: (status: User['status']) => string;
  getStatusLabel: (status: User['status']) => string;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.avatar ? (
              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <i className="ri-user-line text-gray-600"></i>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name || 'Nom non défini'}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
          {getStatusLabel(user.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="text-orange-600 hover:text-orange-900"
          >
            <i className="ri-eye-line"></i>
          </button>
          <button className="text-blue-600 hover:text-blue-900">
            <i className="ri-edit-line"></i>
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="text-red-600 hover:text-red-900"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

// Modal de détails de l'utilisateur
function UserDetailsModal({ 
  user, 
  onClose, 
  onUpdateStatus, 
  onDelete, 
  getRoleColor, 
  getRoleLabel, 
  getStatusColor, 
  getStatusLabel 
}: {
  user: User;
  onClose: () => void;
  onUpdateRole: (id: Id<"users">, role: User['role']) => void;
  onUpdateStatus: (id: Id<"users">, status: User['status']) => void;
  onDelete: (id: Id<"users">) => void;
  getRoleColor: (role: User['role']) => string;
  getRoleLabel: (role: User['role']) => string;
  getStatusColor: (status: User['status']) => string;
  getStatusLabel: (status: User['status']) => string;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Détails de l'utilisateur
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
          {/* Informations générales */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Informations générales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <p className="text-sm text-gray-900">{user.name || 'Nom non défini'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rôle</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {getStatusLabel(user.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Dates importantes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Créé le</label>
                <p className="text-sm text-gray-900">
                  {new Date(user._creationTime).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dernière connexion</label>
                <p className="text-sm text-gray-900">
                  {user.last_login 
                    ? new Date(user.last_login).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Jamais'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => onUpdateStatus(user._id, user.status === 'active' ? 'inactive' : 'active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                user.status === 'active' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <i className={`ri-${user.status === 'active' ? 'pause' : 'play'}-line mr-2`}></i>
              {user.status === 'active' ? 'Désactiver' : 'Activer'}
            </Button>
            <Button
              onClick={() => onDelete(user._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Supprimer
            </Button>
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

// Modal de création d'utilisateur
function CreateUserModal({ 
  onClose, 
  onCreate 
}: {
  onClose: () => void;
  onCreate: (userData: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as User['role'],
    status: 'pending' as User['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Nouvel utilisateur
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="viewer">Consultant</option>
              <option value="editor">Éditeur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Créer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
