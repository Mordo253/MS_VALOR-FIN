import React from 'react';
import { Link } from 'react-router-dom';
import imgh from '../../../assets/heroproperty.jpg'

export const PropertyHero = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img
          src={imgh}
          alt="Luxury home exterior"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-filter backdrop-blur-[2px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full pt-16 md:pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto sm:ml-0">
            {/* Main Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              ENCUENTRA EL LUGAR DE TUS SUEÑOS
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl leading-relaxed">
              Transforma tus sueños en realidad. MS DE VALOR te ofrece una 
              experiencia sin igual en la búsqueda de tu vivienda.
            </p>
            
            {/* CTA Button */}
            <Link 
              to="/properties-list"
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
                VER VIVIENDAS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};