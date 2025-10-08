
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Veuillez saisir votre adresse email');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await fetch('https://readdy.ai/api/form/d3j92l7uqofrij837usg', {
        method: 'POST',
        body: new URLSearchParams(formData as any)
      });

      if (response.ok) {
        setMessage('Merci pour votre inscription !');
        setEmail('');
      } else {
        setMessage('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Conseils d'Expert DR RAVALEMENT</h2>
        <p className="text-orange-100 mb-8">
          Recevez nos conseils techniques et actualités du ravalement
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto" data-readdy-form>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <i className="ri-mail-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : "S'abonner"}
            </button>
          </div>
          {message && (
            <p className={`text-sm mt-3 ${message.includes('Merci') ? 'text-green-100' : 'text-red-100'}`}>
              {message}
            </p>
          )}
          <p className="text-blue-100 text-sm mt-3 text-center">
            Nous respectons votre vie privée. Désabonnement possible à tout moment.
          </p>
        </form>
      </div>
    </section>
  );
}
