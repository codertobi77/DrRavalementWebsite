import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import { BookingService, type BookingData } from '../../lib/booking';
import { BookingEmailService } from '../../lib/booking-email';
import { SiteConfigService, type BookingConfig, type ContactConfig } from '../../lib/site-config';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);
  const [contactConfig, setContactConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Charger la configuration au montage du composant
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [booking, contact] = await Promise.all([
          SiteConfigService.getBookingConfig(),
          SiteConfigService.getContactConfig()
        ]);
        setBookingConfig(booking);
        setContactConfig(contact);
      } catch (error) {
        console.error('Error loading config:', error);
        setError('Erreur lors du chargement de la configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const maxDays = bookingConfig?.maxAdvanceDays || 30;
    
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isWorkingDay = bookingConfig ? 
        dayOfWeek >= bookingConfig.workingDays.start && dayOfWeek <= bookingConfig.workingDays.end : 
        !isWeekend;
      const isPast = i === 0 && today.getHours() >= 17;
      
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        weekday: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        available: isWorkingDay && !isPast
      });
    }
    
    return days;
  };

  // Charger les créneaux disponibles quand la date change
  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimeSlots();
    }
  }, [selectedDate]);

  const loadAvailableTimeSlots = async () => {
    try {
      console.log('Loading time slots for date:', selectedDate);
      const slots = await BookingService.getAvailableTimeSlots(selectedDate);
      console.log('Available slots from database:', slots);
      
      // Utiliser les créneaux de la configuration
      const allSlots = bookingConfig?.timeSlots || ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      const slotsWithAvailability = allSlots.map(time => ({
        time,
        available: slots.includes(time)
      }));
      
      console.log('Time slots with availability:', slotsWithAvailability);
      setTimeSlots(slotsWithAvailability);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setError('Erreur lors du chargement des créneaux disponibles');
      
      // En cas d'erreur, afficher tous les créneaux comme disponibles
      const allSlots = bookingConfig?.timeSlots || ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      const slotsWithAvailability = allSlots.map(time => ({
        time,
        available: true
      }));
      setTimeSlots(slotsWithAvailability);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleServiceSelect = (service: string) => {
    setServiceType(service);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !serviceType) {
      setError('Veuillez sélectionner une date, une heure et un service');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Créer le rendez-vous
      const selectedService = bookingConfig?.services.find(s => s.id === serviceType);
      const bookingData: BookingData = {
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        serviceType: selectedService?.name || serviceType,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService?.duration || 60,
        address: formData.address,
        notes: formData.message
      };

      const booking = await BookingService.createBooking(bookingData);

      // Envoyer les emails de confirmation
      await BookingEmailService.sendBookingEmails({
        ...bookingData,
        bookingId: booking.id
      });

      setBookingSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
      });
      setSelectedDate('');
      setSelectedTime('');
      setServiceType('');

    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la configuration...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-8">
              <div className="flex items-center justify-center space-x-2">
                <i className="ri-check-circle-line text-2xl"></i>
                <h2 className="text-xl font-semibold">Rendez-vous confirmé !</h2>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Merci pour votre confiance !
              </h3>
              <p className="text-gray-600 mb-6">
                Votre rendez-vous a été enregistré avec succès. Vous allez recevoir un email de confirmation 
                dans les prochaines minutes.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setBookingSuccess(false)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Prendre un autre rendez-vous
                </Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Prendre rendez-vous
            </h1>
            <p className="text-xl text-gray-600">
              Réservez votre consultation gratuite ou votre devis personnalisé
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <i className="ri-error-warning-line"></i>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Sélection du service */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez votre service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingConfig?.services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        serviceType === service.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">Durée : {service.duration} min</div>
                      {service.description && (
                        <div className="text-xs text-gray-400 mt-1">{service.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection de la date */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez une date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => handleDateSelect(day.date)}
                      disabled={!day.available}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        selectedDate === day.date
                          ? 'bg-orange-500 text-white border-orange-500'
                          : day.available
                          ? 'bg-white text-gray-900 border-gray-200 hover:border-orange-300'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs font-medium">{day.weekday}</div>
                      <div className="text-lg font-bold">{day.day}</div>
                      <div className="text-xs">{day.month}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection de l'heure */}
              {selectedDate && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choisissez une heure</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-orange-500 text-white border-orange-500'
                            : slot.available
                            ? 'bg-white text-gray-900 border-gray-200 hover:border-orange-300'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations personnelles */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vos informations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Décrivez votre projet ou vos questions..."
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedDate || !selectedTime || !serviceType}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Confirmer le rendez-vous'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}