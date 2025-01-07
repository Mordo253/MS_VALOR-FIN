import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import AdvancedTooltip from '../../../components/ui/Tooltips/AdvancedTooltip';

// Importaciones CSS
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import "./Service.css";

// Importaciones de medios
import video2 from "../../../assets/videoC.mp4";
import video1 from "../../../assets/video1.mp4";
import banner2 from "../../../assets/bannerFH.png";

export const Service = () => {
  const swiperRef = useRef(null);

  const services = [
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Crédito Hipotecario y Leasing",
      content: "Asesoramiento personalizado para obtener tu vivienda ideal. Analizamos las mejores opciones de financiamiento y te guiamos en todo el proceso de adquisición.",
    },
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Crédito de vehículo",
      content: "Facilitamos el proceso de financiación para tu vehículo nuevo o usado. Evaluamos las mejores tasas y condiciones según tu perfil.",
    },
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Crédito por Libranza",
      content: "Obtén financiamiento con descuento directo de nómina. Tasas preferenciales y proceso simplificado para empleados y pensionados.",
    },
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Crédito de consumo",
      content: "Soluciones financieras flexibles para tus necesidades personales. Evaluamos tu capacidad de pago y ofrecemos las mejores condiciones.",
    },
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Seguros de autos, hogar y vida",
      content: "Protección integral para ti y tus bienes. Comparamos diferentes opciones para encontrar la cobertura que mejor se ajuste a tus necesidades.",
    },
    {
      icon: <TrendingUp className="service-icon text-[#C5A572] w-6 h-6" />,
      title: "Servicios de logística y tramites en general",
      content: "Gestión integral de trámites y procesos logísticos. Te ayudamos con la documentación y requisitos necesarios para tus operaciones.",
    },
  ];

  useEffect(() => {
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
      if (index !== 0) {
        video.play().catch(error => console.log("Video autoplay prevented:", error));
      }
    });

    const handleVisibilityChange = () => {
      videos.forEach((video, index) => {
        if (index !== 0) {
          if (document.hidden) {
            video.pause();
          } else {
            video.play().catch(() => {});
          }
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      videos.forEach(video => video.pause());
    };
  }, []);

  return (
    <section className="hero-section relative">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        modules={[EffectFade, Navigation]}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="hero-swiper"
      >
        {/* Slide 1: Servicios */}
        <SwiperSlide>
          <div className="slide-wrapper">
            <div className="media-container">
              <video
                src={video1}
                className="background-video"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="media-overlay" />
            </div>
            
            <div className="content-container services-slide">
              <div className="text-container">
                <h1 className="main-heading">
                  DESCUBRE UNA AMPLIA VARIEDAD DE SERVICIOS
                </h1>
                
                <div className="services-content">
                  <h2 className="services-title mb-6">
                    ASESORIAS EN:
                  </h2>
                  
                  <div className="services-grid">
                    {services.map((service, index) => (
                      <AdvancedTooltip
                        key={index}
                        title={service.title}
                        content={service.content}
                        position="top"
                        delay={200}
                        theme="gold"
                      >
                        <div 
                          className="service-item group flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-white/5"
                          style={{ 
                            animationDelay: `${index * 0.1}s`,
                            '--index': index 
                          }}
                        >
                          <Link to="/posts-list">
                            <div className="icon-wrapper transition-transform duration-300 group-hover:scale-110">
                              {service.icon}
                            </div>
                            <span className="service-label text-gray-100 group-hover:text-[#C5A572] transition-colors duration-300">
                              {service.title}
                            </span>
                          </Link>
                        </div>
                      </AdvancedTooltip>
                    ))}
                  </div>

                  <a
                    href="https://wa.me/573160420188?text=Hola MS DE VALOR. 👋"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button hover:bg-[#C5A572] hover:text-gray-900 transition-all duration-300"
                  >
                    VER MÁS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Inmuebles */}
        <SwiperSlide>
          <div className="slide-wrapper">
            <div className="media-container">
              <img
                src={banner2}
                alt="Inmuebles disponibles"
                className="background-image"
                loading="lazy"
              />
              <div className="media-overlay" />
            </div>
            
            <div className="content-container properties-slide">
              <div className="text-container">
                <h1 className="main-heading">
                  DESCUBRE UNA AMPLIA VARIEDAD DE INMUEBLES
                </h1>
                
                <div className="properties-content">
                  <h2 className="properties-title">
                    ASESORIA INMOBILIARIA
                  </h2>
                  <h3 className="properties-subtitle">
                    EN MS DE VALOR
                  </h3>
                  <p className="properties-description">
                    PONEMOS UNA AMPLIA OFERTA DE PROPIEDADES EN TUS MANOS
                  </p>
                  <Link to="/properties-list" className="cta-button hover:bg-[#C5A572] hover:text-gray-900 transition-all duration-300">
                    VER MÁS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Vehículos */}
        <SwiperSlide>
          <div className="slide-wrapper">
            <div className="media-container">
              <video
                src={video2}
                className="background-video"
                autoPlay
                loop
                muted
                playsInline
                poster={banner2}
              />
              <div className="media-overlay" />
            </div>
            
            <div className="content-container vehicles-slide">
              <div className="text-container">
                <h1 className="main-heading">
                  DESCUBRE UNA AMPLIA VARIEDAD DE VEHÍCULOS
                </h1>
                
                <div className="vehicles-content">
                  <h2 className="vehicles-title">
                    Encuentra con MS De Valor
                  </h2>
                  <p className="vehicles-description">
                    El vehículo de tus Sueños
                  </p>
                  <Link to="/cars-list" className="cta-button hover:bg-[#C5A572] hover:text-gray-900 transition-all duration-300">
                    VER MÁS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Navigation Buttons */}
        <div className="swiper-button-prev">
          <ChevronLeft className="w-8 h-8 text-white" />
        </div>
        <div className="swiper-button-next">
          <ChevronRight className="w-8 h-8 text-white" />
        </div>
      </Swiper>
    </section>
  );
};

export default Service;