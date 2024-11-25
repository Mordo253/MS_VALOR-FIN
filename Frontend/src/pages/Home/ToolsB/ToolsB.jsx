import bannerT from "../../../assets/bannerH.jpeg";
import { Link } from 'react-router-dom';
import { ToolsI } from '../../../components/HomeC/tools/ToolsI';

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
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/tools"
              className="bg-[#C5A572] hover:bg-[#B49562] text-white text-sm font-semibold py-2 px-4 rounded-full inline-block w-full sm:w-auto text-center transition-colors duration-300"
            >
              Conocer más
            </Link>
          </div>
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