import React from 'react';
import { Link } from 'react-router-dom';
import blogHeroImg from '../../../assets/blogHero.jpg';

export const BlogHero = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img
          src={blogHeroImg}
          alt="Blog background"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-filter backdrop-blur-[2px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full pt-16 md:pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Main Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              Bienvenido a + DE MS DE VALOR
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl mx-auto leading-relaxed">
              Explora ideas, reflexiones y recursos únicos en nuestro blog MS De Valor. ¡Descubre algo nuevo en cada publicación!
            </p>

            {/* CTA Button */}
            <Link to="/posts-list" className="inline-block">
              <button
                className="bg-[#B4A160] text-white px-6 sm:px-8 py-2 sm:py-3 
                           rounded-full font-semibold hover:bg-[#ff6363] 
                           transition-all duration-300 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-[#1e90ff] transform hover:scale-105
                           active:scale-95 shadow-lg hover:shadow-xl"
              >
                Ver Publicaciones
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
