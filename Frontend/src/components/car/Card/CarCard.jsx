import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Car, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useVehicles } from '../../../context/CarContext';

export const CarCarousel = ({ onViewAll }) => {
  const navigate = useNavigate();
  const { vehicles, loading, error, getAllVehicles } = useVehicles();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const autoPlayRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Actualiza la cantidad de slides por vista según el tamaño de la pantalla
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      if (width < 640) {
        setSlidesPerView(1);
      } else if (width < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const latestVehicles = vehicles
    .filter(vehicle => vehicle.disponible)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 9);

  const totalSlides = Math.ceil(latestVehicles.length / slidesPerView);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay solo en desktop
  useEffect(() => {
    if (isDesktop) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
      return () => clearInterval(autoPlayRef.current);
    }
  }, [nextSlide, isDesktop]);

  useEffect(() => {
    getAllVehicles();
  }, [getAllVehicles]);

  if (loading) {
    return (
      <div className="text-center p-4 h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 space-y-4">
        <p className="text-lg">{error}</p>
        <button 
          onClick={getAllVehicles}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-yellow-400 font-bold mb-1 sm:mb-2 block text-sm sm:text-base">
            OPCIONES MÁS RECIENTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            VEHÍCULOS AGREGADOS RECIENTEMENTE
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative mb-6 sm:mb-10">
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`absolute -left-2 sm:-left-8 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white 
                  w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full 
                  ${isDesktop ? 'hover:bg-black/75 transition-all duration-300 transform hover:scale-110' : ''}`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className={`absolute -right-2 sm:-right-8 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white 
                  w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full
                  ${isDesktop ? 'hover:bg-black/75 transition-all duration-300 transform hover:scale-110' : ''}`}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex gap-3 sm:gap-6 min-w-full">
                  {latestVehicles
                    .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                    .map((vehicle) => (
                      <div 
                        key={vehicle._id} 
                        className={`${
                          slidesPerView === 1 ? 'w-full' : 
                          slidesPerView === 2 ? 'w-1/2' : 
                          'w-1/3'
                        }`}
                      >
                        <CarCard 
                          vehicle={vehicle}
                          isDesktop={isDesktop}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center">
          <Link to="/cars-list">
            <button
              onClick={onViewAll}
              className={`px-6 sm:px-8 py-2 sm:py-3 bg-yellow-400 text-black text-sm sm:text-base 
                font-bold rounded-lg uppercase ${
                  isDesktop 
                    ? 'transition-all duration-300 hover:bg-yellow-500 hover:transform hover:scale-105 shadow-md' 
                    : ''
                }`}
            >
              Ver todos los vehículos
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const CarCard = ({ vehicle, isDesktop }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleHover = isDesktop ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('COP', '$');
  };

  return (
    <article 
      className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onClick={() => navigate(`/cars/${vehicle._id}`)}
      {...handleHover}
    >
      {/* Imagen con efecto de escala */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse">
        <img 
          src={vehicle.images?.[0]?.secure_url || "/api/placeholder/400/400"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isDesktop && isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
      </div>
      
      {/* Overlay con información */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-b from-transparent 
          via-black/30 to-black p-3 sm:p-4 lg:p-5 transform transition-transform duration-500 ${
            isDesktop ? (isHovered ? 'translate-y-0' : 'translate-y-[62%]') : 'translate-y-0'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="mb-2 sm:mb-3">
            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-white leading-tight">
              {vehicle.brand} - {vehicle.model}
            </h3>
          </div>

          <div className={`flex items-center gap-2 text-white mb-2 sm:mb-3 transition-opacity duration-500 ${
            isDesktop ? (isHovered ? 'opacity-100' : 'opacity-0') : 'opacity-100'
          }`}>
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {formatCurrency(vehicle.price)}
            </span>
          </div>

          <div className={`flex justify-between text-white mb-3 sm:mb-4 transition-opacity duration-500 ${
            isDesktop ? (isHovered ? 'opacity-100' : 'opacity-0') : 'opacity-100'
          }`}>
            <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Car className="w-4 h-4 flex-shrink-0" /> {vehicle.car}
            </span>
            <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Calendar className="w-4 h-4 flex-shrink-0" /> {vehicle.registrationYear}
            </span>
            <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Tag className="w-4 h-4 flex-shrink-0" /> {vehicle.color}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cars/${vehicle._id}`);
            }}
            className={`w-full sm:w-fit px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-black 
              font-bold bg-yellow-400 rounded-lg uppercase transition-all duration-300 
              hover:bg-yellow-500 ${
                isDesktop ? `transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}` : 'opacity-100'
              }`}
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
};