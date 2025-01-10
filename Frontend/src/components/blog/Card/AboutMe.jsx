import React from 'react';
import { motion } from 'framer-motion';
import AdvancedTooltip from '../../ui/Tooltips/AdvancedTooltip';

const AboutMe = () => {
  const teamMembers = [
    {
      name: 'Juan Fernando González',
      role: 'Director',
      image: '/api/placeholder/150/150',
      bio: 'Lorem ipsum, dolor sit amet consect',
      WhatsApp: 'https://wa.me/573122259584?text=Hola Juan Fernando, estoy interesad@ en lo que ofrece MS De Valor',
    },
    {
      name: 'Claudia González',
      role: 'Asesora financiera',
      image: '/api/placeholder/150/150',
      bio: 'Lorem ipsum, dolor sit amet consect',
      WhatsApp: 'https://wa.me/573160420188?text=Hola Claudia, estoy interesad@ en lo que ofrece MS De Valor',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <AdvancedTooltip
            content="Conoce más sobre nuestra historia y equipo"
            theme="light"
            position="left"
          >
            Sobre MS De Valor
          </AdvancedTooltip>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center flex flex-col" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Visión</h3>
            <p className="text-gray-600 flex-grow">
              MS de valor será la compañía de mejores negocios con nuestros aliados, con el aporte de excelentes colaboradores alineados a los valores de la organización.
            </p>
          </motion.div>

          <motion.div className="text-center flex flex-col" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Misión</h3>
            <p className="text-gray-600 flex-grow">
              Generar el mayor valor en la gestión crediticia, enfocados en la mejor experiencia del cliente interno y externo, por medio de la mejora continua de nuestros colaboradores y procesos, garantizando la mejor relación con nuestros aliados.
            </p>
          </motion.div>
          
          <motion.div className="text-center flex flex-col" variants={itemVariants}>
            <AdvancedTooltip
              title="Valores"
              content="Nuestros valores fundamentales guían cada decisión"
              theme="light"
              position="top"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Valores</h3>
            </AdvancedTooltip>
            <p className="text-gray-600 flex-grow">
              Aprendizaje continuo - Compromiso - Satisfacción - Responsabilidad - Respeto - Pasión
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h3
            className="text-3xl font-bold text-center text-gray-800 mb-12"
            variants={containerVariants}
          >
            Conoce al Equipo
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <AdvancedTooltip
                  title={member.name}
                  content={member.bio}
                  image={member.image}
                  link={member.WhatsApp}
                  theme="dark"
                  position="bottom"
                  width="250px"
                  trigger="click"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full object-cover shadow-lg cursor-pointer mb-6"
                  />
                </AdvancedTooltip>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h4>
                <p className="text-lg text-gray-600">{member.role}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutMe;