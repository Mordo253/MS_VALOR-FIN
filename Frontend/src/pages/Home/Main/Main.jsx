import React from 'react';
import { motion } from 'framer-motion';
import { Phone, FileText, ShieldAlert, TrendingUp, PiggyBank } from 'lucide-react';
import "./HeroH.css";
import bannerT from "../../../assets/bannerI.jpeg";
import AdvancedTooltip from '../../../components/ui/Tooltips/AdvancedTooltip';

export const HeroH = () => {
  const services = [
    {
      icon: <FileText className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Asesoría para acelerar pago de créditos",
      content:
        "Te ayudamos a diseñar estrategias personalizadas para reducir el tiempo de pago de tus créditos, optimizando tus finanzas mediante técnicas como pagos anticipados, consolidación de deudas o ajuste de plazos, todo mientras evitas penalidades innecesarias.",
    },
    {
      icon: <PiggyBank className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Consultoría contable y tributaria",
      content:
        "Ofrecemos orientación especializada en temas contables y fiscales para garantizar el cumplimiento normativo, optimizar tus impuestos y organizar mejor tus finanzas. Ideal para empresas o personas naturales que buscan claridad y eficiencia en la gestión tributaria.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Identificación de perfil de riesgo",
      content:
        "Analizamos tu situación financiera, hábitos de consumo y capacidad de pago para determinar tu perfil de riesgo. Este análisis es clave para recomendar productos financieros adecuados y ayudarte a tomar decisiones informadas sobre crédito, ahorro e inversión.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
      title: "Pautas de ahorros e inversión",
      content:
        "Recibe recomendaciones personalizadas para construir hábitos de ahorro efectivos y elegir las mejores opciones de inversión según tus metas, perfil de riesgo y horizonte de tiempo. Nuestro enfoque te ayuda a crecer financieramente con seguridad.",
    },
  ];

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
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

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Columna de contenido */}
          <div className="flex flex-col justify-center space-y-6 px-6 lg:px-12 relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
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

            {/* Lista de servicios */}
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 cursor-help group"
                >
                  <AdvancedTooltip
                    title={service.title}
                    content={service.content}
                    theme="light"
                    position="right"
                  >
                    <div className="flex items-center space-x-2 gap-4">
                      <div className="service-icon">{service.icon}</div>
                      <p className="text-white text-sm md:text-base group-hover:text-amber-200">
                        {service.title}
                      </p>
                    </div>
                  </AdvancedTooltip>
                </div>
              ))}
            </div>

            {/* Botón de acción */}
            <a
              href={`https://wa.me/573160420188?text=Hola MS DE VALOR, estoy interesado en sus servicios`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-amber-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-amber-300"
            >
              <Phone className="w-5 h-5" />
              <span>Cotiza aquí</span>
            </a>
          </div>

          {/* Columna de imagen */}
          <div className="relative h-full hidden lg:block">
            <img
              src={bannerT}
              alt="Financial analysis"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-600/50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
