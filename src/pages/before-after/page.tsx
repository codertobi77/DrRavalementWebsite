import React from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import BeforeAfterGallery from '../../components/cms/BeforeAfterGallery';

export default function BeforeAfter() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Avant / Après
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos réalisations et l'impact de nos travaux de ravalement de façade
            </p>
          </div>

          <BeforeAfterGallery />
        </div>
      </main>

      <Footer />
    </div>
  );
}
