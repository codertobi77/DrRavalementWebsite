
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Careers() {
  const jobOffers = [
    {
      id: 1,
      title: 'Façadier Expérimenté',
      type: 'CDI',
      location: 'Seine-et-Marne',
      experience: '3-5 ans',
      description: 'Nous recherchons un façadier expérimenté pour rejoindre notre équipe. Maîtrise de la projection machine et des finitions traditionnelles requise.',
      requirements: [
        'Expérience minimum 3 ans en ravalement',
        'Maîtrise projection machine',
        'Connaissance des finitions grattée, talochée, lissée',
        'Permis B obligatoire',
        'Travail en équipe'
      ],
      benefits: [
        'Salaire attractif selon expérience',
        'Véhicule de fonction',
        'Mutuelle entreprise',
        'Formation continue',
        'Primes de performance'
      ]
    },
    {
      id: 2,
      title: 'Maçon Qualifié',
      type: 'CDI',
      location: 'Île-de-France',
      experience: '2-4 ans',
      description: 'Poste de maçon pour travaux de construction, réparation et aménagements extérieurs. Polyvalence et autonomie appréciées.',
      requirements: [
        'CAP Maçonnerie ou équivalent',
        'Expérience en maçonnerie générale',
        'Lecture de plans',
        'Respect des règles de sécurité',
        'Disponibilité et ponctualité'
      ],
      benefits: [
        'Évolution de carrière possible',
        'Équipements fournis',
        'Formations spécialisées',
        'Ambiance de travail conviviale',
        '13ème mois'
      ]
    },
    {
      id: 3,
      title: 'Apprenti Façadier',
      type: 'Apprentissage',
      location: 'Le Pecq',
      experience: 'Débutant',
      description: 'Formation en alternance pour devenir façadier. Accompagnement par nos équipes expérimentées et formation théorique en centre.',
      requirements: [
        'Motivation et sérieux',
        'Aptitude au travail en hauteur',
        'Bonne condition physique',
        'Esprit d\'équipe',
        'Âge : 16-25 ans'
      ],
      benefits: [
        'Formation complète métier',
        'Encadrement professionnel',
        'Possibilité d\'embauche',
        'Rémunération progressive',
        'Expérience terrain'
      ]
    },
    {
      id: 4,
      title: 'Chef d\'Équipe Ravalement',
      type: 'CDI',
      location: 'Seine-et-Marne',
      experience: '5+ ans',
      description: 'Encadrement d\'équipe et coordination de chantiers de ravalement. Responsabilité technique et organisationnelle.',
      requirements: [
        'Expérience 5 ans minimum',
        'Capacités d\'encadrement',
        'Maîtrise techniques ravalement',
        'Gestion planning chantier',
        'Relation client'
      ],
      benefits: [
        'Poste à responsabilités',
        'Salaire motivant',
        'Participation aux bénéfices',
        'Formation management',
        'Évolution possible'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Rejoignez <span className="text-orange-400">Notre Équipe</span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                DR RAVALEMENT recrute des professionnels passionnés pour développer ensemble l'excellence dans le ravalement et la maçonnerie
              </p>
            </div>
          </div>
        </section>

        {/* Pourquoi nous rejoindre */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi Rejoindre DR RAVALEMENT ?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une entreprise en croissance qui valorise ses collaborateurs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-team-line text-3xl text-orange-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Esprit d'Équipe</h3>
                <p className="text-gray-600">
                  Rejoignez une équipe soudée où l'entraide et la convivialité sont au cœur de notre réussite commune.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-graduation-cap-line text-3xl text-orange-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Formation Continue</h3>
                <p className="text-gray-600">
                  Développez vos compétences grâce à nos formations régulières sur les nouvelles techniques et technologies.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-trophy-line text-3xl text-orange-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Évolution de Carrière</h3>
                <p className="text-gray-600">
                  Progressez dans votre carrière avec des opportunités d'évolution vers des postes à responsabilités.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Nos Valeurs</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-shield-check-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Qualité & Excellence</h3>
                      <p className="text-gray-600">
                        Nous visons l'excellence dans chaque projet, avec des standards de qualité élevés et un souci du détail constant.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-handshake-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Respect & Confiance</h3>
                      <p className="text-gray-600">
                        Relations basées sur le respect mutuel, la confiance et la transparence entre tous les collaborateurs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-lightbulb-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation & Apprentissage</h3>
                      <p className="text-gray-600">
                        Ouverture aux nouvelles techniques et technologies pour rester à la pointe de notre métier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Équipe DR RAVALEMENT" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Offres d'Emploi */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Offres d'Emploi</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez nos opportunités actuelles et postulez dès maintenant
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobOffers.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-map-pin-line mr-1"></i>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {job.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{job.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Profil Recherché :</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <i className="ri-check-line text-orange-600 mt-0.5 flex-shrink-0"></i>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Nous Offrons :</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <i className="ri-star-line text-orange-600 mt-0.5 flex-shrink-0"></i>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap">
                    Postuler Maintenant
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Candidature Spontanée */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Candidature Spontanée</h2>
                <p className="text-lg text-gray-600">
                  Vous ne trouvez pas l'offre qui vous correspond ? Envoyez-nous votre candidature spontanée !
                </p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input 
                      type="tel" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste Recherché
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message de Motivation *
                  </label>
                  <textarea 
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Parlez-nous de votre expérience, vos motivations et ce que vous pourriez apporter à notre équipe..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV (PDF, DOC, DOCX - Max 5Mo)
                  </label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    J'accepte que mes données personnelles soient utilisées pour traiter ma candidature conformément à la politique de confidentialité. *
                  </label>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  Envoyer ma Candidature
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Contact RH */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Ressources Humaines</h2>
              <p className="text-lg text-gray-600">
                Une question sur nos offres d'emploi ? Contactez notre service RH
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-phone-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">+33 1 39 58 90 15</p>
                <p className="text-sm text-gray-500">Lun-Ven: 9h-17h</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-mail-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">rh@dr-ravalement.fr</p>
                <p className="text-sm text-gray-500">Réponse sous 48h</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-map-pin-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">Seine-et-Marne</p>
                <p className="text-sm text-gray-500">Île-de-France</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à Nous Rejoindre ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Faites partie d'une équipe dynamique et participez à notre croissance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#candidature" 
                className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Postuler Maintenant
              </a>
              <a 
                href="tel:+33139589015" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
              >
                Nous Appeler
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
