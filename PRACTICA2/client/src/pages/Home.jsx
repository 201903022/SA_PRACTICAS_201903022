import React from 'react';
import '../styles/tailwind.css'
const FeatureItem = ({ emoji, title, description }) => (
  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="text-4xl mb-4">{emoji}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            Nueva App Delivery 2026
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
            ¿Tienes hambre? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Nosotros te lo llevamos.
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Pide en tus restaurantes favoritos y sigue tu pedido en tiempo real hasta tu puerta. 
            Calidad, rapidez y el mejor servicio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">
              Explorar Restaurantes
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all">
              Ver Promociones
            </button>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem 
            emoji="🛵" 
            title="Súper Rápido" 
            description="Nuestro algoritmo de logística asegura que tu comida llegue caliente en tiempo récord."
          />
          <FeatureItem 
            emoji="💎" 
            title="Premium Solo" 
            description="Seleccionamos cuidadosamente los mejores restaurantes de la ciudad para ti."
          />
          <FeatureItem 
            emoji="📱" 
            title="Trackeo en Vivo" 
            description="Mira exactamente dónde viene tu repartidor en el mapa en tiempo real."
          />
        </div>
      </section>
    </main>
  );
};

export default Home;