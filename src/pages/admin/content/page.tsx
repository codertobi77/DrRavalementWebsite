import { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import StatisticEditModal from '../../../components/admin/modals/StatisticEditModal';
import ServiceEditModal from '../../../components/admin/modals/ServiceEditModal';
import ZoneEditModal from '../../../components/admin/modals/ZoneEditModal';
import ReasonEditModal from '../../../components/admin/modals/ReasonEditModal';
import TestimonialEditModal from '../../../components/admin/modals/TestimonialEditModal';
import CompanyHistoryEditModal from '../../../components/admin/modals/CompanyHistoryEditModal';
import ValueEditModal from '../../../components/admin/modals/ValueEditModal';
import TeamMemberEditModal from '../../../components/admin/modals/TeamMemberEditModal';
import CertificationEditModal from '../../../components/admin/modals/CertificationEditModal';
import ProcessStepEditModal from '../../../components/admin/modals/ProcessStepEditModal';
import ProjectFilterEditModal from '../../../components/admin/modals/ProjectFilterEditModal';
import PortfolioProjectEditModal from '../../../components/admin/modals/PortfolioProjectEditModal';
import TestCMSConnection from '../../../components/cms/TestCMSConnection';
import ImageWithFallback from '../../../components/admin/ImageWithFallback';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('statistics');
  
  // États pour les modales
  const [isStatisticModalOpen, setIsStatisticModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [isProcessStepModalOpen, setIsProcessStepModalOpen] = useState(false);
  const [isProjectFilterModalOpen, setIsProjectFilterModalOpen] = useState(false);
  const [isPortfolioProjectModalOpen, setIsPortfolioProjectModalOpen] = useState(false);
  
  // États pour les éléments en cours d'édition
  const [editingStatistic, setEditingStatistic] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [editingReason, setEditingReason] = useState<any>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [editingHistory, setEditingHistory] = useState<any>(null);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [editingProcessStep, setEditingProcessStep] = useState<any>(null);
  const [editingProjectFilter, setEditingProjectFilter] = useState<any>(null);
  const [editingPortfolioProject, setEditingPortfolioProject] = useState<any>(null);
  
  // États de chargement
  const [isLoading, setIsLoading] = useState(false);

  // Hooks Convex pour les données
  const statistics = useQuery(api.cms.getStatistics);
  const services = useQuery(api.cms.getServices);
  const zones = useQuery(api.cms.getZones);
  const reasons = useQuery(api.cms.getReasons);
  const testimonials = useQuery(api.cms.getTestimonials);
  const companyHistory = useQuery(api.cms.getCompanyHistory);
  const values = useQuery(api.cms.getValues);
  const teamMembers = useQuery(api.cms.getTeamMembers);
  const certifications = useQuery(api.cms.getCertifications);
  const processSteps = useQuery(api.cms.getProcessSteps);
  const projectFilters = useQuery(api.cms.getProjectFilters);
  const portfolioProjects = useQuery(api.cms.getPortfolioProjects);

  // Mutations
  const createStatistic = useMutation(api.cms.createStatistic);
  const updateStatistic = useMutation(api.cms.updateStatistic);
  const deleteStatistic = useMutation(api.cms.deleteStatistic);

  const createService = useMutation(api.cms.createService);
  const updateService = useMutation(api.cms.updateService);
  const deleteService = useMutation(api.cms.deleteService);

  const createZone = useMutation(api.cms.createZone);
  const updateZone = useMutation(api.cms.updateZone);
  const deleteZone = useMutation(api.cms.deleteZone);

  const createReason = useMutation(api.cms.createReason);
  const updateReason = useMutation(api.cms.updateReason);
  const deleteReason = useMutation(api.cms.deleteReason);

  const createTestimonial = useMutation(api.cms.createTestimonial);
  const updateTestimonial = useMutation(api.cms.updateTestimonial);
  const deleteTestimonial = useMutation(api.cms.deleteTestimonial);

  const updateCompanyHistory = useMutation(api.cms.updateCompanyHistory);

  const createValue = useMutation(api.cms.createValue);
  const updateValue = useMutation(api.cms.updateValue);
  const deleteValue = useMutation(api.cms.deleteValue);

  const createTeamMember = useMutation(api.cms.createTeamMember);
  const updateTeamMember = useMutation(api.cms.updateTeamMember);
  const deleteTeamMember = useMutation(api.cms.deleteTeamMember);

  const createCertification = useMutation(api.cms.createCertification);
  const updateCertification = useMutation(api.cms.updateCertification);
  const deleteCertification = useMutation(api.cms.deleteCertification);

  const createProcessStep = useMutation(api.cms.createProcessStep);
  const updateProcessStep = useMutation(api.cms.updateProcessStep);
  const deleteProcessStep = useMutation(api.cms.deleteProcessStep);

  const createProjectFilter = useMutation(api.cms.createProjectFilter);
  const updateProjectFilter = useMutation(api.cms.updateProjectFilter);
  const deleteProjectFilter = useMutation(api.cms.deleteProjectFilter);

  const createPortfolioProject = useMutation(api.cms.createPortfolioProject);
  const updatePortfolioProject = useMutation(api.cms.updatePortfolioProject);
  const deletePortfolioProject = useMutation(api.cms.deletePortfolioProject);

  // Fonctions de gestion des statistiques
  const handleStatisticSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingStatistic) {
        // Ne passer que les champs modifiables, pas _id ni _creationTime
        const { _id, _creationTime, ...updateData } = data;
        await updateStatistic({ id: editingStatistic._id, ...updateData });
      } else {
        await createStatistic(data);
      }
      setIsStatisticModalOpen(false);
      setEditingStatistic(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatisticEdit = (statistic: any) => {
    setEditingStatistic(statistic);
    setIsStatisticModalOpen(true);
  };

  const handleStatisticDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteStatistic({ id });
      setIsStatisticModalOpen(false);
      setEditingStatistic(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des services
  const handleServiceSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingService) {
        // Ne passer que les champs modifiables, pas _id ni _creationTime
        const { _id, _creationTime, ...updateData } = data;
        await updateService({ id: editingService._id, ...updateData });
      } else {
        await createService(data);
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceEdit = (service: any) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleServiceDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteService({ id });
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des zones
  const handleZoneSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingZone) {
        // Ne passer que les champs modifiables, pas _id ni _creationTime
        const { _id, _creationTime, ...updateData } = data;
        await updateZone({ id: editingZone._id, ...updateData });
      } else {
        await createZone(data);
      }
      setIsZoneModalOpen(false);
      setEditingZone(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoneEdit = (zone: any) => {
    setEditingZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleZoneDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteZone({ id });
      setIsZoneModalOpen(false);
      setEditingZone(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des raisons
  const handleReasonSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingReason) {
        // Ne passer que les champs modifiables, pas _id ni _creationTime
        const { _id, _creationTime, ...updateData } = data;
        await updateReason({ id: editingReason._id, ...updateData });
      } else {
        await createReason(data);
      }
      setIsReasonModalOpen(false);
      setEditingReason(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonEdit = (reason: any) => {
    setEditingReason(reason);
    setIsReasonModalOpen(true);
  };

  const handleReasonDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteReason({ id });
      setIsReasonModalOpen(false);
      setEditingReason(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des témoignages
  const handleTestimonialSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingTestimonial) {
        // Ne passer que les champs modifiables, pas _id ni _creationTime
        const { _id, _creationTime, ...updateData } = data;
        await updateTestimonial({ id: editingTestimonial._id, ...updateData });
      } else {
        await createTestimonial(data);
      }
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestimonialEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteTestimonial({ id });
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion de l'histoire de l'entreprise
  const handleHistorySave = async (data: any) => {
    setIsLoading(true);
    try {
      const { _id, _creationTime, ...updateData } = data;
      await updateCompanyHistory({ id: editingHistory._id, ...updateData });
      setIsHistoryModalOpen(false);
      setEditingHistory(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryEdit = (history: any) => {
    setEditingHistory(history);
    setIsHistoryModalOpen(true);
  };

  // Fonctions de gestion des valeurs
  const handleValueSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingValue) {
        const { _id, _creationTime, ...updateData } = data;
        await updateValue({ id: editingValue._id, ...updateData });
      } else {
        await createValue(data);
      }
      setIsValueModalOpen(false);
      setEditingValue(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueEdit = (value: any) => {
    setEditingValue(value);
    setIsValueModalOpen(true);
  };

  const handleValueDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteValue({ id });
      setIsValueModalOpen(false);
      setEditingValue(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des membres d'équipe
  const handleTeamMemberSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingTeamMember) {
        const { _id, _creationTime, ...updateData } = data;
        await updateTeamMember({ id: editingTeamMember._id, ...updateData });
      } else {
        await createTeamMember(data);
      }
      setIsTeamMemberModalOpen(false);
      setEditingTeamMember(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamMemberEdit = (member: any) => {
    setEditingTeamMember(member);
    setIsTeamMemberModalOpen(true);
  };

  const handleTeamMemberDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteTeamMember({ id });
      setIsTeamMemberModalOpen(false);
      setEditingTeamMember(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des certifications
  const handleCertificationSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingCertification) {
        const { _id, _creationTime, ...updateData } = data;
        await updateCertification({ id: editingCertification._id, ...updateData });
      } else {
        await createCertification(data);
      }
      setIsCertificationModalOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificationEdit = (certification: any) => {
    setEditingCertification(certification);
    setIsCertificationModalOpen(true);
  };

  const handleCertificationDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteCertification({ id });
      setIsCertificationModalOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des étapes de processus
  const handleProcessStepSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingProcessStep) {
        const { _id, _creationTime, ...updateData } = data;
        await updateProcessStep({ id: editingProcessStep._id, ...updateData });
      } else {
        await createProcessStep(data);
      }
      setIsProcessStepModalOpen(false);
      setEditingProcessStep(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessStepEdit = (step: any) => {
    setEditingProcessStep(step);
    setIsProcessStepModalOpen(true);
  };

  const handleProcessStepDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteProcessStep({ id });
      setIsProcessStepModalOpen(false);
      setEditingProcessStep(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des filtres de projets
  const handleProjectFilterSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingProjectFilter) {
        const { _id, _creationTime, ...updateData } = data;
        await updateProjectFilter({ id: editingProjectFilter._id, ...updateData });
      } else {
        await createProjectFilter(data);
      }
      setIsProjectFilterModalOpen(false);
      setEditingProjectFilter(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectFilterEdit = (filter: any) => {
    setEditingProjectFilter(filter);
    setIsProjectFilterModalOpen(true);
  };

  const handleProjectFilterDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deleteProjectFilter({ id });
      setIsProjectFilterModalOpen(false);
      setEditingProjectFilter(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion des projets de portfolio
  const handlePortfolioProjectSave = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingPortfolioProject) {
        const { _id, _creationTime, ...updateData } = data;
        await updatePortfolioProject({ id: editingPortfolioProject._id, ...updateData });
      } else {
        await createPortfolioProject(data);
      }
      setIsPortfolioProjectModalOpen(false);
      setEditingPortfolioProject(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortfolioProjectEdit = (project: any) => {
    setEditingPortfolioProject(project);
    setIsPortfolioProjectModalOpen(true);
  };

  const handlePortfolioProjectDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await deletePortfolioProject({ id });
      setIsPortfolioProjectModalOpen(false);
      setEditingPortfolioProject(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'statistics', label: 'Statistiques', icon: 'ri-bar-chart-line' },
    { id: 'services', label: 'Services', icon: 'ri-tools-line' },
    { id: 'zones', label: 'Zones', icon: 'ri-map-pin-line' },
    { id: 'reasons', label: 'Raisons', icon: 'ri-thumb-up-line' },
    { id: 'testimonials', label: 'Témoignages', icon: 'ri-chat-quote-line' },
    { id: 'history', label: 'Histoire', icon: 'ri-history-line' },
    { id: 'values', label: 'Valeurs', icon: 'ri-heart-line' },
    { id: 'team', label: 'Équipe', icon: 'ri-team-line' },
    { id: 'certifications', label: 'Certifications', icon: 'ri-award-line' },
    { id: 'process', label: 'Processus', icon: 'ri-list-ordered' },
    { id: 'filters', label: 'Filtres', icon: 'ri-filter-line' },
    { id: 'projects', label: 'Projets', icon: 'ri-image-line' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Statistiques</h2>
              <button 
                onClick={() => {
                  setEditingStatistic(null);
                  setIsStatisticModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une statistique</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {statistics?.map((stat) => (
                <div key={stat._id} className="responsive-card bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{stat.label}</h3>
                    <div className="flex justify-center sm:justify-end space-x-2">
                      <button 
                        onClick={() => handleStatisticEdit(stat)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button 
                        onClick={() => handleStatisticDelete(stat._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3">Clé: {stat.key}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stat.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {stat.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button 
                onClick={() => {
                  setEditingService(null);
                  setIsServiceModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter un service</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {services?.map((service) => (
                <div key={service._id} className="responsive-card bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{service.title}</h3>
                    <div className="flex justify-center sm:justify-end space-x-2">
                      <button 
                        onClick={() => handleServiceEdit(service)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button 
                        onClick={() => handleServiceDelete(service._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
                  {service.objective && (
                    <div className="mb-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <h4 className="text-xs font-semibold text-orange-800 mb-1">Objectif</h4>
                      <p className="text-xs text-orange-700">{service.objective}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Fonctionnalités:</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <i className="ri-check-line text-green-600 mt-0.5 flex-shrink-0"></i>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {service.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'zones':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Zones d'Intervention</h2>
              <button 
                onClick={() => {
                  setEditingZone(null);
                  setIsZoneModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une zone</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones?.map((zone) => (
                <div key={zone._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{zone.name}</span>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          zone.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {zone.is_active ? 'Actif' : 'Inactif'}
                        </span>
                        <span className="text-xs text-gray-400">Ordre: {zone.order_index}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => handleZoneEdit(zone)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleZoneDelete(zone._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reasons':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Pourquoi Nous Choisir</h2>
              <button 
                onClick={() => {
                  setEditingReason(null);
                  setIsReasonModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une raison</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons?.map((reason) => (
                <div key={reason._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <i className={`${reason.icon} text-orange-600 text-xl`}></i>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{reason.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleReasonEdit(reason)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleReasonDelete(reason._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{reason.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reason.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reason.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {reason.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Témoignages</h2>
              <button 
                onClick={() => {
                  setEditingTestimonial(null);
                  setIsTestimonialModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter un témoignage</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials?.map((testimonial) => (
                <div key={testimonial._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{testimonial.author}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleTestimonialEdit(testimonial)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleTestimonialDelete(testimonial._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">"{testimonial.text}"</blockquote>
                  <p className="text-sm text-gray-500 mb-4">{testimonial.project}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {testimonial.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {testimonial.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Histoire de l'Entreprise</h2>
              <button 
                onClick={() => {
                  setEditingHistory(companyHistory);
                  setIsHistoryModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-edit-line"></i>
                <span>Modifier l'histoire</span>
              </button>
            </div>
            {companyHistory && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{companyHistory.title}</h3>
                <div className="space-y-4 mb-6">
                  {companyHistory.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-700">{paragraph}</p>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {companyHistory.statistics.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <img 
                  src={companyHistory.image} 
                  alt="Histoire de l'entreprise"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        );

      case 'values':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Valeurs</h2>
              <button 
                onClick={() => {
                  setEditingValue(null);
                  setIsValueModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une valeur</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values?.map((value) => (
                <div key={value._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <i className={`${value.icon} text-orange-600 text-xl`}></i>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleValueEdit(value)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleValueDelete(value._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{value.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {value.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {value.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipe</h2>
              <button 
                onClick={() => {
                  setEditingTeamMember(null);
                  setIsTeamMemberModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter un membre</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {teamMembers?.map((member) => (
                <div key={member._id} className="responsive-card bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <div className="flex-1">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 object-cover"
                        fallbackText="Photo non disponible"
                        onError={() => console.error('Erreur chargement image membre:', member.name)}
                        onLoad={() => console.log('Image membre chargée:', member.name)}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-orange-600 font-medium mb-2 text-sm sm:text-base">{member.role}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">{member.description}</p>
                    </div>
                    <div className="flex justify-center sm:justify-end space-x-2">
                      <button 
                        onClick={() => handleTeamMemberEdit(member)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button 
                        onClick={() => handleTeamMemberDelete(member._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {member.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
              <button 
                onClick={() => {
                  setEditingCertification(null);
                  setIsCertificationModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une certification</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications?.map((cert) => (
                <div key={cert._id} className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className={`${cert.icon} text-orange-600 text-2xl`}></i>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{cert.title}</h3>
                      <p className="text-gray-600 text-sm">{cert.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleCertificationEdit(cert)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleCertificationDelete(cert._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cert.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {cert.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Processus de Travail</h2>
              <button 
                onClick={() => {
                  setEditingProcessStep(null);
                  setIsProcessStepModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter une étape</span>
              </button>
            </div>
            <div className="space-y-4">
              {processSteps?.map((step, index) => (
                <div key={step._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleProcessStepEdit(step)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleProcessStepDelete(step._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      step.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {step.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-xs text-gray-400">Ordre: {step.order_index}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Filtres de Projets</h2>
              <button 
                onClick={() => {
                  setEditingProjectFilter(null);
                  setIsProjectFilterModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter un filtre</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectFilters?.map((filter) => (
                <div key={filter._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{filter.label}</span>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          filter.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {filter.is_active ? 'Actif' : 'Inactif'}
                        </span>
                        <span className="text-xs text-gray-400">Ordre: {filter.order_index}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => handleProjectFilterEdit(filter)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Modifier"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button 
                        onClick={() => handleProjectFilterDelete(filter._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets de Réalisation</h2>
              <button 
                onClick={() => {
                  setEditingPortfolioProject(null);
                  setIsPortfolioProjectModalOpen(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <i className="ri-add-line"></i>
                <span>Ajouter un projet</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {portfolioProjects?.map((project) => (
                <div key={project._id} className="responsive-card bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Images avant-après */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {/* Image avant */}
                      <div className="w-1/2 border-r border-white">
                        <ImageWithFallback
                          src={project.before_image}
                          alt={`${project.title} - Avant`}
                          className="w-full h-full object-cover"
                          fallbackText="Avant"
                          onError={() => console.error('Erreur chargement image avant:', project.title)}
                          onLoad={() => console.log('Image avant chargée:', project.title)}
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                          Avant
                        </div>
                      </div>
                      {/* Image après */}
                      <div className="w-1/2">
                        <ImageWithFallback
                          src={project.after_image}
                          alt={`${project.title} - Après`}
                          className="w-full h-full object-cover"
                          fallbackText="Après"
                          onError={() => console.error('Erreur chargement image après:', project.title)}
                          onLoad={() => console.log('Image après chargée:', project.title)}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                          Après
                        </div>
                      </div>
                    </div>
                    {/* Badge de catégorie */}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                        project.category === 'ravalement' ? 'bg-blue-100 text-blue-800' :
                        project.category === 'maconnerie' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {project.category === 'ravalement' ? 'Ravalement' :
                         project.category === 'maconnerie' ? 'Maçonnerie' : 'Couverture'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{project.title}</h3>
                      <div className="flex justify-center sm:justify-end space-x-2">
                        <button 
                          onClick={() => handlePortfolioProjectEdit(project)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Modifier"
                        >
                          <i className="ri-edit-line text-sm"></i>
                        </button>
                        <button 
                          onClick={() => handlePortfolioProjectDelete(project._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Supprimer"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">{project.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">{project.details}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.is_active ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="text-xs text-gray-400">Ordre: {project.order_index}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Contenu non trouvé</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Gestion du Contenu
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gérez le contenu modifiable de votre site web
            </p>
          </div>

          {/* Composant de test pour vérifier la connexion CMS */}
          <div className="mb-8">
          </div>

          {/* Navigation par onglets - Responsive */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6 px-4 lg:px-6 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    <span className="hidden lg:inline">{tab.label}</span>
                    <span className="lg:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </nav>
              
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full p-4 text-sm border-0 border-b-2 border-gray-200 focus:border-orange-500 focus:ring-0 bg-transparent"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Modales d'édition */}
      <StatisticEditModal
        isOpen={isStatisticModalOpen}
        onClose={() => {
          setIsStatisticModalOpen(false);
          setEditingStatistic(null);
        }}
        onSave={handleStatisticSave}
        onDelete={editingStatistic ? () => handleStatisticDelete(editingStatistic._id) : undefined}
        statistic={editingStatistic}
        isLoading={isLoading}
      />

      <ServiceEditModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleServiceSave}
        onDelete={editingService ? () => handleServiceDelete(editingService._id) : undefined}
        service={editingService}
        isLoading={isLoading}
      />

      <ZoneEditModal
        isOpen={isZoneModalOpen}
        onClose={() => {
          setIsZoneModalOpen(false);
          setEditingZone(null);
        }}
        onSave={handleZoneSave}
        onDelete={editingZone ? () => handleZoneDelete(editingZone._id) : undefined}
        zone={editingZone}
        isLoading={isLoading}
      />

      <ReasonEditModal
        isOpen={isReasonModalOpen}
        onClose={() => {
          setIsReasonModalOpen(false);
          setEditingReason(null);
        }}
        onSave={handleReasonSave}
        onDelete={editingReason ? () => handleReasonDelete(editingReason._id) : undefined}
        reason={editingReason}
        isLoading={isLoading}
      />

      <TestimonialEditModal
        isOpen={isTestimonialModalOpen}
        onClose={() => {
          setIsTestimonialModalOpen(false);
          setEditingTestimonial(null);
        }}
        onSave={handleTestimonialSave}
        onDelete={editingTestimonial ? () => handleTestimonialDelete(editingTestimonial._id) : undefined}
        testimonial={editingTestimonial}
        isLoading={isLoading}
      />

      <CompanyHistoryEditModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setEditingHistory(null);
        }}
        onSave={handleHistorySave}
        history={editingHistory}
        isLoading={isLoading}
      />

      <ValueEditModal
        isOpen={isValueModalOpen}
        onClose={() => {
          setIsValueModalOpen(false);
          setEditingValue(null);
        }}
        onSave={handleValueSave}
        onDelete={editingValue?._id ? () => handleValueDelete(editingValue._id) : undefined}
        value={editingValue}
        isLoading={isLoading}
      />

      <TeamMemberEditModal
        isOpen={isTeamMemberModalOpen}
        onClose={() => {
          setIsTeamMemberModalOpen(false);
          setEditingTeamMember(null);
        }}
        onSave={handleTeamMemberSave}
        onDelete={editingTeamMember?._id ? () => handleTeamMemberDelete(editingTeamMember._id) : undefined}
        member={editingTeamMember}
        isLoading={isLoading}
      />

      <CertificationEditModal
        isOpen={isCertificationModalOpen}
        onClose={() => {
          setIsCertificationModalOpen(false);
          setEditingCertification(null);
        }}
        onSave={handleCertificationSave}
        onDelete={editingCertification?._id ? () => handleCertificationDelete(editingCertification._id) : undefined}
        certification={editingCertification}
        isLoading={isLoading}
      />

      <ProcessStepEditModal
        isOpen={isProcessStepModalOpen}
        onClose={() => {
          setIsProcessStepModalOpen(false);
          setEditingProcessStep(null);
        }}
        onSave={handleProcessStepSave}
        onDelete={editingProcessStep?._id ? () => handleProcessStepDelete(editingProcessStep._id) : undefined}
        step={editingProcessStep}
        isLoading={isLoading}
      />

      <ProjectFilterEditModal
        isOpen={isProjectFilterModalOpen}
        onClose={() => {
          setIsProjectFilterModalOpen(false);
          setEditingProjectFilter(null);
        }}
        onSave={handleProjectFilterSave}
        onDelete={editingProjectFilter?._id ? () => handleProjectFilterDelete(editingProjectFilter._id) : undefined}
        filter={editingProjectFilter}
        isLoading={isLoading}
      />

      <PortfolioProjectEditModal
        isOpen={isPortfolioProjectModalOpen}
        onClose={() => {
          setIsPortfolioProjectModalOpen(false);
          setEditingPortfolioProject(null);
        }}
        onSave={handlePortfolioProjectSave}
        onDelete={editingPortfolioProject?._id ? () => handlePortfolioProjectDelete(editingPortfolioProject._id) : undefined}
        project={editingPortfolioProject}
        isLoading={isLoading}
      />
      
      <Footer />
    </div>
  );
}
