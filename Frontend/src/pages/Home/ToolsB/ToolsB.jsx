import bannerT from "../../../assets/bannerH.jpeg";
import { Link } from 'react-router-dom';
import { ToolsI } from '../../../components/HomeC/tools/ToolsI';

const ToolsButton = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
        {/* CTA Button */}
        <Link 
          to="/tools"
          className="inline-block"
        >
          <button 
            className="bg-[#b4a160] text-black px-6 sm:px-8 py-2 sm:py-3 
                      rounded-full font-semibold hover:bg-gray-100 
                      transition-all duration-300 text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-[#b4a160] transform hover:scale-105
                      active:scale-95 shadow-lg hover:shadow-xl"
          >
            CONOCER MÁS
          </button>
        </Link>
    </div>
  );
};
export const ToolsB = () => {
  // Definimos las variables de color basadas en el logo
  const primaryGray = '#808080';  // Gris principal
  const accentGold = '#C5A572';   // Dorado/oro del logo

  return (
    <section className="w-full h-auto bg-gray-800 rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row relative">
        {/* Sección Izquierda (Texto y Herramientas) */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-12 md:py-16 z-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">CONOCE NUESTRAS</span>
            <br />
            <span className="text-[#C5A572]">HERRAMIENTAS</span>
          </h1>
          <div className="mb-8">
            <ToolsI />
          </div>
          <ToolsButton/>
        </div>

        {/* Sección Derecha (Imagen de fondo) */}
        <div className="flex-1 relative min-h-[200px] md:min-h-[400px] lg:min-h-[500px]">
          <img 
            src={bannerT} 
            alt="Shopping online" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Superposición de Gradiente */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgb(31, 41, 55, 1), rgba(31, 41, 55, 0.8), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
};