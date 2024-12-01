  import React from 'react';
  import bannerWU from '../../../assets/bannerWU.png';
  import { LuBookmark } from "react-icons/lu";

  export const WorkUs = () => {
    return (
      <section className="min-h-screen bg-white py-16 relative overflow-hidden flex items-center">
        <div className="container mx-auto px-6 lg:px-12 h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full">
            
            {/* Contenido Izquierdo */}
            <div className="w-full lg:w-1/2 space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900">
                Trabaja Con Nosotros
              </h1>
              
              <p className="text-xl text-gray-700 max-w-lg">
                Si quieres tener ingresos extras, con comisiones sin tope y además manejar tu tiempo.
              </p> 
              
              <button className="relative bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-colors z-10">
                <LuBookmark />  
                <a href="https://forms.gle/xYUR5rkCETamEVyXA" target='_blank'>
                    Aplica Aquí
                </a>
              </button>
            </div>
            
            {/* Contenido Derecho */}
            <div className="w-full lg:w-1/2 relative flex justify-center h-full">
              <div className="relative w-full h-full max-w-2xl"> {/* Cambié max-w-lg por max-w-2xl */}
                {/* Fondo amarillo ajustado con z-0 */}
                <div className="absolute z-0 right-0 top-0 w-72 h-72 bg-yellow-500 rounded-full opacity-50 translate-x-1/4 -translate-y-1/4" />
                <img
                  src={bannerWU}
                  alt="Professional woman in business attire"
                  className="relative z-10 w-full h-[500px] object-cover" // Aumenté la altura
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
