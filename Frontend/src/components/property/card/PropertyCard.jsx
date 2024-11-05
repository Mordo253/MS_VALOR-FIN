import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { useProperties } from '../../../context/PropertyContex';

export const PropertyCarousel = ({ onViewAll }) => {
  const navigate = useNavigate();
  const { properties, loading, error, getAllProperties } = useProperties();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const latestProperties = properties
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 9);

  const totalSlides = Math.ceil(latestProperties.length / 3);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    getAllProperties();
  }, [getAllProperties]);

  if (loading) {
    return <div className="text-center p-4">Cargando propiedades...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
        <button 
          onClick={getAllProperties}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-16">
        <div className="text-center mb-8">
          <span className="text-yellow-400 font-bold mb-2 block">
            TU MEJOR ELECCIÓN
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            PROPIEDADES RECIÉN AGREGADAS
          </h2>
        </div>

        <div className="relative mb-10">
          <button
            onClick={prevSlide}
            className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex gap-6 min-w-full">
                  {latestProperties
                    .slice(slideIndex * 3, (slideIndex + 1) * 3)
                    .map((property) => (
                      <div key={property._id} className="w-1/3">
                        <PropertyCard 
                          property={property}
                          onSelect={() => navigate(`/properties/${property._id}`)}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/properties-list">
            <button
              onClick={onViewAll}
              className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg uppercase transition-all duration-300 hover:bg-yellow-500 hover:transform hover:scale-105 shadow-md"
            >
              Ver todas las propiedades
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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
      className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
      onClick={() => navigate(`/properties/${property._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={property.images?.[0]?.secure_url || "/api/placeholder/400/400"}
        alt={property.title}
        className={`absolute w-full h-full object-cover transition-transform duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
      />
      
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-b from-transparent via-black/30 to-black p-5 transform transition-transform duration-500 ${
          isHovered ? 'translate-y-0' : 'translate-y-[62%]'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="relative mb-3">
            <h3 className="font-bold text-xl text-white leading-tight">
              {property.tipoInmueble} - {property.zona} - {property.ciudad}
            </h3>
          </div>

          <div className={`flex items-center gap-3 text-white mb-3 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <DollarSign size={16} className="flex-shrink-0" />
            <span>
              {formatCurrency(property.costo)}
            </span>
          </div>

          <div className={`flex justify-between text-white mb-4 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="flex items-center gap-2">
              <Bed size={16} className="flex-shrink-0" /> {property.alcobas}
            </span>
            <span className="flex items-center gap-2">
              <Bath size={16} className="flex-shrink-0" /> {property.banos}
            </span>
            <span className="flex items-center gap-2">
              <Square size={16} className="flex-shrink-0" /> {property.areaConstruida} m²
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${property._id}`);
            }}
            className={`mt-auto px-6 py-3 w-fit text-black font-bold bg-yellow-400 rounded-lg uppercase transition-opacity duration-500 hover:bg-yellow-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
};