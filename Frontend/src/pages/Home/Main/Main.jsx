import React from 'react';
import { Phone, Search, FileText, ShieldAlert, TrendingUp, PiggyBank } from 'lucide-react';
import "./HeroH.css";
import bannerT from "../../../assets/bannerI.jpeg";

export const HeroH = () => {
  const services = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Asesoría para acelerar pago de créditos",
    },
    {
      icon: <PiggyBank className="w-6 h-6" />,
      title: "Consultoría contable y tributaria",
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "Identificación de perfil de riesgo",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Pautas de ahorros e inversión",
    },
  ];

  return (
    <section className="w-full">
      <div className="h-screen w-screen bg-gradient-to-r from-[#1C1C1C] to-gray-500 relative">
        {/* Círculos superiores - Primera fila */}
        <div className="absolute top-4 left-4">
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={`ring1-${i}`} className="w-4 h-4 rounded-full border-2 border-gray-700"></div>
            ))}
          </div>
        </div>

        {/* Círculos superiores - Segunda fila */}
        <div className="absolute top-12 left-4">
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={`ring2-${i}`} className="w-4 h-4 rounded-full bg-amber-200/20"></div>
            ))}
          </div>
        </div>

        {/* Patrón de cruces */}
        <div className="absolute bottom-0 left-0 opacity-20">
          <div className="grid grid-cols-6 gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="text-amber-200 text-xs">×</div>
            ))}
          </div>
        </div>

        {/* Patrón de puntos */}
        <div className="absolute bottom-16 right-16 opacity-20">
          <div className="grid grid-cols-6 gap-1">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-amber-200 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="gray-circle"></div>

        {/* Contenido Principal */}
        <div className="w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Columna izquierda - Contenido */}
            <div className="flex flex-col justify-center space-y-8 px-6 lg:px-12">
              <div className="space-y-3 mt-4">
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  En MS De Valor te{' '}
                  <br />
                  ayudamos a{' '}
                  <span className="text-amber-200">potencializar</span>
                  <br />
                  tus finanzas
                </h1>
                <p className="text-xl text-gray-300">
                  llevándolas al siguiente nivel
                </p>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-amber-200">
                      {service.icon}
                    </div>
                    <p className="text-gray-300">{service.title}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 bg-transparent border-2 border-amber-200 text-amber-200 px-6 py-3 rounded-full hover:bg-amber-200 hover:text-black transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>Cotiza aquí</span>
                </button>
                <div className="absolute -right-4 -bottom-4 w-32 h-16 border-b-2 border-r-2 border-amber-200 opacity-20 rounded-br-xl"></div>
              </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="relative h-full">
              <img 
                src={bannerT} 
                alt="Financial analysis" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-600/50"></div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-white p-2 rounded-full shadow-lg">
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