
import Button from '../../../components/base/Button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h2 className="text-4xl font-bold text-white mb-6">Votre Projet de Ravalement Nous Attend</h2>
          <p className="text-xl text-orange-100 mb-8">
            Devis gratuit et personnalisé sous 24h par DR RAVALEMENT
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" href="/contact">
              Devis Gratuit Immédiat
            </Button>
            <Button variant="outline" size="lg" href="/portfolio">
              Voir Nos Réalisations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
