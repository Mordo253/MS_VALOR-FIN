import React from 'react';
import { Phone, Search, FileText, ShieldAlert, TrendingUp, PiggyBank } from 'lucide-react';
import "./HeroH.css";
import bannerT from "../../../assets/bannerI.jpeg";

export const HeroH = () => {
  const services = [
    {
      icon: <FileText className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Asesoría para acelerar pago de créditos",
    },
    {
      icon: <PiggyBank className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Consultoría contable y tributaria",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Identificación de perfil de riesgo",
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Pautas de ahorros e inversión",
    },
  ];

  return (
    <section className="w-full h-[100vh] overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-r from-[#1C1C1C] to-gray-500">
        {/* Círculos responsivos */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 scale-75 md:scale-100">
          <div className="flex gap-2 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={`ring1-${i}`} 
                className="w-2 h-2 md:w-4 md:h-4 rounded-full border-2 border-gray-700"
              />
            ))}
          </div>
        </div>

        <div className="absolute top-8 md:top-12 left-2 md:left-4 scale-75 md:scale-100">
          <div className="flex gap-2 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={`ring2-${i}`} 
                className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-amber-200/20"
              />
            ))}
          </div>
        </div>

        {/* Patrones decorativos responsivos */}
        <div className="absolute bottom-0 left-0 opacity-20 scale-75 md:scale-100">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-1 md:gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="text-amber-200 text-[8px] md:text-xs">×</div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-16 right-8 md:right-16 opacity-20 scale-75 md:scale-100">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-0.5 md:gap-1">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 md:w-1 md:h-1 bg-amber-200 rounded-full" />
            ))}
          </div>
        </div>

        {/* Círculo gris */}
        <div className="gray-circle"></div>

        {/* Contenido Principal */}
        <div className="w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Columna de contenido */}
            <div className="flex flex-col justify-center space-y-4 md:space-y-8 px-4 md:px-6 lg:px-12 relative top-8 z-10">
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                  En MS De Valor te{' '}
                  <br className="hidden md:block" />
                  ayudamos a{' '}
                  <span className="text-amber-200">potencializar</span>
                  <br className="hidden md:block" />
                  tus finanzas
                </h2>
                <p className="text-lg md:text-xl text-gray-300">
                  llevándolas al siguiente nivel
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="service-item">
                    <div className="service-icon">
                      {service.icon}
                    </div>
                    <p className="service-text">
                      {service.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="cta-container">
                <button className="cta-button">
                  <Phone className="phone-icon" />
                  <span>Cotiza aquí</span>
                </button>
                <div className="button-decoration" />
              </div>
            </div>

            {/* Columna de imagen */}
            <div className="relative h-full hidden lg:block">
              <img 
                src={bannerT} 
                alt="Financial analysis" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-600/50"></div>
              <div className="absolute bottom-4 right-4 transform hover:scale-110 transition-transform duration-300">
                <div className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl">
                  <Search className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
