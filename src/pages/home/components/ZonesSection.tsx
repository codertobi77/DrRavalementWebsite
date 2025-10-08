
export default function ZonesSection() {
  const zones = [
    "Le Pecq",
    "Seine-et-Marne", 
    "Yvelines",
    "Val-d'Oise",
    "Essonne",
    "Hauts-de-Seine"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Zones d'Intervention</h2>
          <p className="text-gray-600 mb-8">
            DR RAVALEMENT intervient dans toute la Seine-et-Marne et l'Île-de-France
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {zones.map((zone, index) => (
              <span 
                key={index}
                className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
