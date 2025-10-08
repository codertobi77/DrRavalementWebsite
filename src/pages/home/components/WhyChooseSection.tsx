
export default function WhyChooseSection() {
  const reasons = [
    {
      icon: "ri-building-line",
      title: "Spécialiste Façades",
      description: "Expert en ravalement par projection machine avec toutes finitions"
    },
    {
      icon: "ri-hammer-line",
      title: "Maçonnerie Complète",
      description: "Travaux de maçonnerie générale, murs, clôtures et fondations"
    },
    {
      icon: "ri-shield-check-line",
      title: "Garantie Qualité",
      description: "Assurance décennale et garantie sur tous nos travaux"
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir DR RAVALEMENT ?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`${reason.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-gray-300">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
