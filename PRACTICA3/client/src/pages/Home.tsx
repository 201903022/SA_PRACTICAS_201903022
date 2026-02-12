import React from 'react';

// 1. Definimos la interfaz para las props de FeatureItem
interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

// Subcomponente tipado
const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description }) => (
  <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group">
    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 transform-gpu">
      {emoji}
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight italic">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

const Home: React.FC = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block py-2 px-4 rounded-full bg-indigo-50 text-[#5842F4] text-xs font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100">
            Nueva App Delivery 2026
          </span>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter italic">
            ¿TIENES HAMBRE? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5842F4] to-[#8A79FF]">
              NOSOTROS TE LO LLEVAMOS.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            Pide en tus restaurantes favoritos y sigue tu pedido en tiempo real hasta tu puerta. 
            <span className="text-slate-900 font-bold"> Calidad, rapidez y el mejor servicio.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="w-full sm:w-auto px-12 py-5 bg-[#5842F4] text-white font-black rounded-2xl hover:bg-[#4633d1] shadow-2xl shadow-indigo-200 transition-all active:scale-95 text-lg uppercase tracking-wider">
              Explorar Restaurantes
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-white text-gray-900 font-black rounded-2xl border-2 border-slate-100 hover:border-[#5842F4] hover:text-[#5842F4] transition-all text-lg uppercase tracking-wider">
              Ver Promociones
            </button>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureItem 
            emoji="🛵" 
            title="Súper Rápido" 
            description="Nuestro algoritmo de logística asegura que tu comida llegue caliente y en tiempo récord a tu hogar."
          />
          <FeatureItem 
            emoji="💎" 
            title="Premium Solo" 
            description="Seleccionamos cuidadosamente los mejores restaurantes de la ciudad para garantizar tu satisfacción."
          />
          <FeatureItem 
            emoji="📱" 
            title="Trackeo en Vivo" 
            description="Mira exactamente dónde viene tu repartidor en el mapa en tiempo real desde tu dispositivo móvil."
          />
        </div>
      </section>
    </main>
  );
};

export default Home;