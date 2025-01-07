import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const SocialCTA = () => {
  const socialLinks = [
    { icon: <FaFacebook />, label: 'Facebook', url: 'https://www.facebook.com/MSdeValor/' },
    { icon: <FaInstagram />, label: 'Instagram', url: 'https://www.instagram.com/msdevalor/' },
  ];

  return (
    <div className="bg-gradient-to-r from-black to-[#737373] text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ¡Conéctate con Nosotros!
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Sigue nuestras redes sociales para estar al tanto de las últimas noticias, contenido exclusivo y más.
          </motion.p>
        </div>

        {/* Contenido: Texto e Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Texto */}
          <motion.div
            className="text-lg sm:text-xl leading-relaxed"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Descubre cómo nuestra comunidad se conecta y comparte en las principales plataformas. ¡Sé parte de nuestra historia!
            </p>
            <p className="mt-4">
              Nos apasiona interactuar contigo y compartir contenido valioso. Únete a nosotros y ayúdanos a crecer juntos.
            </p>
          </motion.div>

          {/* Imágenes */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-64 h-64">
              <img
                src="https://via.placeholder.com/200"
                alt="Imagen 1"
                className="absolute top-0 left-0 w-48 h-48 object-cover rounded-lg shadow-lg transform rotate-6"
              />
              <img
                src="https://via.placeholder.com/200"
                alt="Imagen 2"
                className="absolute bottom-0 right-0 w-48 h-48 object-cover rounded-lg shadow-lg transform -rotate-6"
              />
            </div>
          </motion.div>
        </div>

        {/* Redes Sociales */}
        <div className="mt-10 text-center">
          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white text-black rounded-full shadow-lg text-2xl 
                          hover:bg-gray-100 transition-transform duration-300 transform 
                          hover:scale-110 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-white"
              >
                {link.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SocialCTA;
