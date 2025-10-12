import React from 'react';
import Modal from '../base/Modal';

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  features?: string[];
  detailedDescription?: string;
  process?: string[];
  benefits?: string[];
  duration?: string;
  price?: string;
  materials?: string[];
}

interface ServiceDetailsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceDetailsModal({ service, isOpen, onClose }: ServiceDetailsModalProps) {
  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.title} size="xl">
      <div className="space-y-6">
        {/* Image */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-service.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Description principale */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
          <p className="text-gray-700 leading-relaxed">
            {service.detailedDescription || service.description}
          </p>
        </div>

        {/* Objectif */}
        {service.objective && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Objectif</h4>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <p className="text-orange-800 leading-relaxed">
                {service.objective}
              </p>
            </div>
          </div>
        )}

        {/* Caractéristiques */}
        {service.features && service.features.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Caractéristiques</h4>
            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <i className="ri-check-line text-orange-600 mt-1 flex-shrink-0"></i>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Avantages */}
        {service.benefits && service.benefits.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Avantages</h4>
            <ul className="space-y-2">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <i className="ri-star-line text-orange-600 mt-1 flex-shrink-0"></i>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Processus */}
        {service.process && service.process.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Notre Processus</h4>
            <div className="space-y-3">
              {service.process.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matériaux utilisés */}
        {service.materials && service.materials.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Matériaux Utilisés</h4>
            <div className="flex flex-wrap gap-2">
              {service.materials.map((material, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informations pratiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
          {service.duration && (
            <div className="flex items-center space-x-3">
              <i className="ri-time-line text-orange-600 text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Durée</p>
                <p className="text-gray-700">{service.duration}</p>
              </div>
            </div>
          )}
          {service.price && (
            <div className="flex items-center space-x-3">
              <i className="ri-price-tag-3-line text-orange-600 text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Tarif</p>
                <p className="text-gray-700">{service.price}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <a 
            href="/quote-calculator" 
            className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-orange-700 transition-colors"
          >
            Demander un Devis
          </a>
          <a 
            href="/contact" 
            className="flex-1 border border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-orange-50 transition-colors"
          >
            Nous Contacter
          </a>
        </div>
      </div>
    </Modal>
  );
}
