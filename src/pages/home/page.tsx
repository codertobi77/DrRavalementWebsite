
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ZonesSection from './components/ZonesSection';
import WhyChooseSection from './components/WhyChooseSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import CTASection from './components/CTASection';
import TestCMSConnection from '../../components/cms/TestCMSConnection';
import CTALinksSection from '../../components/cms/CTALinksSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="overflow-hidden">
          <HeroSection />
          <ServicesSection />
          <ZonesSection />
          <WhyChooseSection />
          <TestimonialsSection />
          <NewsletterSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
