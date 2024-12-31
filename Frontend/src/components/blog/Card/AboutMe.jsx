import React from 'react';
import { motion } from 'framer-motion';
import AdvancedTooltip from '../../ui/Tooltips/AdvancedTooltip';

const AboutMe = () => {
  const teamMembers = [
    {
      name: 'Juan Pérez',
      role: 'Desarrollador Web',
      image: 'https://via.placeholder.com/150',
      bio: 'Especialista en React y Node.js con 5 años de experiencia',
      github: 'https://github.com/juanperez',
      linkedin: 'https://linkedin.com/in/juanperez',
    },
    {
      name: 'Ana García',
      role: 'Diseñadora Gráfica',
      image: 'https://via.placeholder.com/150',
      bio: 'Experta en UI/UX y diseño de marca',
      portfolio: 'https://behance.net/anagarcia',
      instagram: 'https://instagram.com/anagarcia',
    },
    {
      name: 'Carlos López',
      role: 'Gestor de Contenidos',
      image: 'https://via.placeholder.com/150',
      bio: 'Creador de contenido digital y estratega SEO',
      blog: 'https://medium.com/@carloslopez',
      twitter: 'https://twitter.com/carloslopez',
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
          <motion.div className="text-center" variants={itemVariants}>
            <AdvancedTooltip
              title="Misión"
              content="Nuestra misión se centra en crear contenido que inspire y transforme vidas"
              theme="light"
              position="top"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Misión</h3>
            </AdvancedTooltip>
            <p className="text-gray-600">
              Brindar contenido de calidad y auténtico para inspirar y conectar con mi audiencia.
            </p>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <AdvancedTooltip
              title="Visión"
              content="Aspiramos a ser líderes en innovación y calidad de contenido"
              theme="light"
              position="top"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Visión</h3>
            </AdvancedTooltip>
            <p className="text-gray-600">
              Ser una referencia en el mundo del blogging, destacando por creatividad y valor humano.
            </p>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <AdvancedTooltip
              title="Valores"
              content="Nuestros valores fundamentales guían cada decisión"
              theme="light"
              position="top"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 cursor-help">Valores</h3>
            </AdvancedTooltip>
            <p className="text-gray-600">
              Autenticidad, compromiso, innovación y trabajo en equipo.
            </p>
          </motion.div>
        </motion.div>

        <div>
          <motion.h3
            className="text-3xl font-bold text-center text-gray-800 mb-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            Conoce al Equipo
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <AdvancedTooltip
                  title={member.name}
                  content={member.bio}
                  image={member.image}
                  link={member.portfolio || member.github || member.blog}
                  theme="dark"
                  position="bottom"
                  width="250px"
                  trigger="click"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md cursor-pointer"
                  />
                </AdvancedTooltip>
                <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;