import { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import ConfirmationModal from '../../../components/base/ConfirmationModal';
import { useOptimizedAdminUsers, useOptimizedAdminUsersByRole, useOptimizedAdminUsersByStatus } from '../../../hooks/useOptimizedCmsData';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirmation } from '../../../hooks/useConfirmation';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks pour les toasters et confirmations
  const { showSuccess, showError, showWarning } = useToast();
  const { isOpen, isLoading, options, confirm, handleConfirm, handleCancel } = useConfirmation();

  // Utiliser les hooks optimisés avec cache
  const { data: allUsers, isLoading: allUsersLoading, refresh: refreshAllUsers } = useOptimizedAdminUsers();
  const { data: usersByRole, isLoading: usersByRoleLoading, refresh: refreshUsersByRole } = useOptimizedAdminUsersByRole(filter);
  const { data: usersByStatus, isLoading: usersByStatusLoading, refresh: refreshUsersByStatus } = useOptimizedAdminUsersByStatus(statusFilter);

  // Mutations
  const createUserMutation = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUserMutation = useMutation(api.users.deleteUser);

  // Utiliser les données filtrées
  const users = filter !== 'all' ? usersByRole : statusFilter !== 'all' ? usersByStatus : allUsers;
  const loading = filter !== 'all' ? usersByRoleLoading : statusFilter !== 'all' ? usersByStatusLoading : allUsersLoading;

  // Type assertion pour les données Convex
  const typedUsers = (users ?? []) as User[];

  // Filtrer les utilisateurs par terme de recherche
  const filteredUsers = typedUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filter === 'all' || user.role === filter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const updateUserRole = async (userId: Id<"users">, role: User['role']) => {
    try {
      await updateUser({ id: userId, role });
      setSelectedUser(null);
      refreshAllUsers();
      refreshUsersByRole();
      refreshUsersByStatus();
      showSuccess('Rôle mis à jour', 'Le rôle de l\'utilisateur a été modifié avec succès.');
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Erreur de mise à jour', 'Impossible de modifier le rôle de l\'utilisateur.');
    }
  };

  const updateUserStatus = async (userId: Id<"users">, status: User['status']) => {
    try {
      await updateUser({ id: userId, status });
      setSelectedUser(null);
      refreshAllUsers();
      refreshUsersByRole();
      refreshUsersByStatus();
      showSuccess('Statut mis à jour', 'Le statut de l\'utilisateur a été modifié avec succès.');
    } catch (error) {
      console.error('Error updating user status:', error);
      showError('Erreur de mise à jour', 'Impossible de modifier le statut de l\'utilisateur.');
    }
  };

  const deleteUserHandler = async (userId: Id<"users">) => {
    const user = typedUsers.find(u => u._id === userId);    confirm({
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user?.name || user?.email}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteUserMutation({ id: userId });
          setSelectedUser(null);
          refreshAllUsers();
          refreshUsersByRole();
          refreshUsersByStatus();
          showSuccess('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès.');
        } catch (error) {
          console.error('Error deleting user:', error);
          showError('Erreur de suppression', 'Impossible de supprimer l\'utilisateur.');
        }
      },
    });
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

  const createUserHandler = async (userData: { name: string; email: string; role: User['role']; status: User['status'] }) => {
    try {
      await createUserMutation({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status
      });
      setShowCreateModal(false);
      refreshAllUsers();
      refreshUsersByRole();
      refreshUsersByStatus();
      showSuccess('Utilisateur créé', 'L\'utilisateur a été créé avec succès.');
    } catch (error) {
      console.error('Error creating user:', error);
      showError('Erreur de création', 'Impossible de créer l\'utilisateur.');
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-2">Gérez les accès et permissions des utilisateurs</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                refreshAllUsers();
                refreshUsersByRole();
                refreshUsersByStatus();
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <i className="ri-add-line mr-2"></i>
              Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="editor">Éditeurs</option>
                <option value="viewer">Consultants</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Utilisateurs ({filteredUsers.length})
            </h3>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-user-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' || statusFilter !== 'all'
                  ? 'Aucun utilisateur ne correspond aux filtres sélectionnés'
                  : 'Commencez par ajouter votre premier utilisateur'}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <i className="ri-add-line mr-2"></i>
                Ajouter un Utilisateur
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <i className="ri-user-line text-gray-600"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 truncate">
                            {user.name || 'Nom non défini'}
                          </h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                        <span className="text-gray-500">
                          <i className="ri-time-line mr-1"></i>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Voir détails"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>

                      <button
                        onClick={() => console.log('Modifier', user._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-lg"></i>
                      </button>

                      <button
                        onClick={() => deleteUserHandler(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </AdminLayout>
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

      {/* Modal de confirmation */}
    </div>
  );}