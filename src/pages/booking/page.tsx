
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const services = [
    { id: 'consultation', name: 'Consultation gratuite', duration: '1h' },
    { id: 'devis', name: 'Visite pour devis', duration: '1h30' },
    { id: 'expertise', name: 'Expertise technique', duration: '2h' },
    { id: 'suivi', name: 'Suivi de chantier', duration: '30min' }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true }
  ];

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          weekday: date.toLocaleDateString('fr-FR', { weekday: 'short' })
        });
      }
    }
    
    return days.slice(0, 14); // Show next 14 working days
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate booking confirmation
    alert(`Rendez-vous confirmé pour le ${selectedDate} à ${selectedTime}. Vous recevrez une confirmation par email.`);
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setServiceType('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      message: ''
    });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Réserver un Rendez-vous
            </h1>
            <p className="text-xl text-gray-600">
              Planifiez facilement votre consultation ou visite technique
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Type de rendez-vous
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setServiceType(service.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      serviceType === service.id
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-600">Durée: {service.duration}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choisir une date
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedDate === day.date
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-sm text-gray-500 mb-1">{day.weekday}</div>
                    <div className="text-lg font-semibold">{day.day}</div>
                    <div className="text-sm text-gray-500">{day.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choisir un horaire
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        !slot.available
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && (
                        <div className="text-xs text-gray-400 mt-1">Occupé</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {selectedDate && selectedTime && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Vos informations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse du projet
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Adresse complète"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du projet
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Décrivez brièvement votre projet..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.message.length}/500 caractères
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {selectedDate && selectedTime && serviceType && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Récapitulatif de votre rendez-vous</h3>
                <div className="space-y-2 mb-6">
                  <p><strong>Service:</strong> {services.find(s => s.id === serviceType)?.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Heure:</strong> {selectedTime}</p>
                </div>
                
                <Button
                  type="submit"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  disabled={!formData.name || !formData.email || !formData.phone}
                >
                  Confirmer le rendez-vous
                </Button>
              </div>
            )}
          </form>

          {/* Contact Info */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Besoin d'aide pour réserver ?
              </h3>
              <p className="text-gray-600 mb-6">
                Notre équipe est disponible pour vous accompagner
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33139589015"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-phone-line"></i>
                  <span>+33 1 39 58 90 15</span>
                </a>
                <button
                  onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
                >
                  <i className="ri-chat-3-line"></i>
                  <span>Chat en direct</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
