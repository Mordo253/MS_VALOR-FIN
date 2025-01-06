import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

// Importaciones de estilos
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import "./Service.css";

// Importaciones de medios
import video2 from "../../../assets/videoC.mp4";
import video1 from "../../../assets/video1.mp4";
import banner2 from "../../../assets/bannerFH.png";
import AdvancedTooltip from '../../../components/ui/Tooltips/AdvancedTooltip';

export const Service = () => {
  const swiperRef = useRef(null);

  // Lista de servicios
  const services = [
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Crédito Hipotecario y Leasing",
      content:
        "",
      link:"",
    },
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Crédito de vehículo",
      content:
        "",
      link:"",
    },
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Crédito por Libranza",
      content:
        "",
      link:"",
    },
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Crédito de consumo",
      content:
        "",
      link:"",
    },
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Seguros de autos, hogar y vida",
      content:
        "",
      link:"",
    },
    {
      icon: <TrendingUp className="service-icon" />,
      title: "Servicios de logística y tramites en general",
      content:
        "",
      link:"",
    },
  ];

  // Configuración del Swiper
  const swiperParams = {
    spaceBetween: 0,
    slidesPerView: 1,
    effect: "fade",
    modules: [EffectFade, Navigation],
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    }
  };

  // Manejo de efectos y optimizaciones
  useEffect(() => {
    const videos = document.querySelectorAll('video');
    
    // Optimización de reproducción de video
    videos.forEach(video => {
      video.play().catch(function(error) {
        console.log("Video autoplay prevented:", error);
      });
    });

    // Manejo de visibilidad de página
    const handleVisibilityChange = () => {
      videos.forEach(video => {
        if (document.hidden) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Limpieza
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      videos.forEach(video => video.pause());
    };
  }, []);

  return (
    <section className="hero-section relative">
      <Swiper {...swiperParams} className="hero-swiper">
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
                poster={banner2}
              />
              <div className="media-overlay" />
            </div>
            
            <div className="content-container services-slide">
              <div className="text-container">
                <h1 className="main-heading">
                  DESCUBRE UNA AMPLIA VARIEDAD DE SERVICIOS
                </h1>
                
                <div className="services-content">
                  <h2 className="services-title">
                    ASESORIAS EN:
                  </h2>
                  
                  <div className="services-grid">
                    {services.map((service, index) => (
                      <div 
                        key={index} 
                        className="service-item"
                        style={{ 
                          animationDelay: `${index * 0.1}s`,
                          '--index': index 
                        }}
                      >
                        <AdvancedTooltip
                          title={service.title}
                          content={service.content}
                          theme="light"
                          position="top"
                        >
                          <div className="icon-wrapper">
                            {service.icon}
                          </div>
                          <span className="service-label">
                            {service.title}
                          </span>
                        </AdvancedTooltip>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://wa.me/573160420188?text=Hola MS DE VALOR. 👋"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button"
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
                  <Link to="/properties-list" className="cta-button">
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
                  <Link to="/cars-list" className="cta-button">
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