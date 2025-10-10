
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import ContactInfoSection from '../../components/cms/ContactInfoSection';
import CompanyInfoSection from '../../components/cms/CompanyInfoSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://readdy.ai/api/form/d3j9a6ekn7r41cr5kspg', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <CompanyInfoSection variant="about" />
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Devis gratuit sous 24h • Intervention en Seine-et-Marne et Île-de-France
              </p>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactInfoSection variant="page" className="mb-16" />
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Formulaire */}
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Demande de Devis Gratuit</h2>
                  <p className="text-gray-600 mb-8">
                    Remplissez ce formulaire et recevez votre devis personnalisé sous 24h
                  </p>
                  
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      Votre demande a été envoyée avec succès ! Nous vous recontacterons sous 24h.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      Une erreur s'est produite. Veuillez réessayer ou nous appeler directement.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} data-readdy-form id="contact-form" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input 
                          type="text" 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input 
                          type="text" 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input 
                          type="tel" 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Souhaité *
                      </label>
                      <select 
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
                      >
                        <option value="">Sélectionnez un service</option>
                        <option value="ravalement">Ravalement de Façades</option>
                        <option value="maconnerie">Maçonnerie Générale</option>
                        <option value="couverture">Couverture & Étanchéité</option>
                        <option value="isolation">Isolation Thermique</option>
                        <option value="reparation">Réparations Urgentes</option>
                        <option value="autre">Autre (préciser dans le message)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Description de votre projet *
                      </label>
                      <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        required
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Décrivez votre projet : type de bâtiment, surface approximative, travaux souhaités, délais..."
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.message.length}/500 caractères
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="consent"
                        required
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-600">
                        J'accepte d'être recontacté par DR RAVALEMENT concernant ma demande et j'ai lu la politique de confidentialité. *
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma Demande'}
                    </button>
                  </form>
                </div>
                
                {/* Informations */}
                <div className="bg-orange-600 p-8 lg:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6">Pourquoi Choisir DR RAVALEMENT ?</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <i className="ri-time-line text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold mb-2">Devis Rapide</h4>
                        <p className="text-orange-100">Réponse garantie sous 24h avec devis détaillé</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <i className="ri-shield-check-line text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold mb-2">Assurance Décennale</h4>
                        <p className="text-orange-100">Tous nos travaux sont couverts par notre assurance</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <i className="ri-award-line text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold mb-2">15 Ans d'Expérience</h4>
                        <p className="text-orange-100">Expertise reconnue en ravalement et maçonnerie</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <i className="ri-map-pin-line text-2xl mt-1"></i>
                      <div>
                        <h4 className="font-semibold mb-2">Proximité</h4>
                        <p className="text-orange-100">Intervention rapide en Seine-et-Marne et Île-de-France</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zones d'intervention */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Zones d'Intervention</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                DR RAVALEMENT intervient dans toute la Seine-et-Marne et l'Île-de-France
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Principales Communes Servies</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-3">Seine-et-Marne</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Le Pecq</li>
                      <li>• Meaux</li>
                      <li>• Chelles</li>
                      <li>• Torcy</li>
                      <li>• Melun</li>
                      <li>• Fontainebleau</li>
                      <li>• Provins</li>
                      <li>• Coulommiers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-3">Île-de-France</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Yvelines</li>
                      <li>• Val-d'Oise</li>
                      <li>• Essonne</li>
                      <li>• Hauts-de-Seine</li>
                      <li>• Val-de-Marne</li>
                      <li>• Seine-Saint-Denis</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-600 mt-6">
                  Votre commune ne figure pas dans la liste ? Contactez-nous, nous étudions toute demande dans un rayon de 50km.
                </p>
              </div>
              
              {/* <div className="relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.9!2d2.6!3d48.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ4JzAwLjAiTiAywrAzNicwMC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%" 
                  height="400" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl shadow-lg"
                ></iframe>
              </div> */}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
              <p className="text-xl text-gray-600">
                Les réponses aux questions les plus courantes sur nos services
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Combien coûte un ravalement de façade ?
                </h3>
                <p className="text-gray-600">
                  Le prix varie selon la surface, l'état de la façade et les finitions choisies. Comptez entre 40€ et 80€/m² pour un ravalement complet. Nous proposons un devis gratuit et détaillé.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quelle est la durée des travaux ?
                </h3>
                <p className="text-gray-600">
                  Pour une maison individuelle, comptez 1 à 3 semaines selon la surface et les travaux. Pour un immeuble, la durée peut aller de 1 à 3 mois. Nous vous donnons un planning précis dans notre devis.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Faut-il une autorisation pour ravaler sa façade ?
                </h3>
                <p className="text-gray-600">
                  Une déclaration préalable en mairie est généralement nécessaire. Dans certains secteurs protégés, un permis de construire peut être requis. Nous vous accompagnons dans ces démarches.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quelles garanties proposez-vous ?
                </h3>
                <p className="text-gray-600">
                  Nous proposons une garantie décennale sur tous nos travaux de gros œuvre et une garantie de parfait achèvement d'un an. Nos assurances couvrent tous les dommages éventuels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
