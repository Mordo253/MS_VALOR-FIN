// Footer.jsx
import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import footerF from '../../assets/footerF.jpg';
import footerC from '../../assets/footerC.jpg';
import footerH from '../../assets/footerH.jpg';
import imglog from "../../assets/MS5.png";
import './Footer.css';

// Componente para imágenes circulares
const CircleImage = ({ src, alt }) => (
  <div className="circle-image-container">
    <div className="circle-image-wrapper">
      <img 
        src={src} 
        alt={alt}
        className="circle-image"
        loading="lazy"
      />
    </div>
  </div>
);

// Componente para enlaces sociales
const SocialLink = ({ href, Icon }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
  >
    <Icon />
  </a>
);

// Componente para elementos de servicio
const ServiceItem = ({ text }) => (
  <div className="service-item">
    <span className="service-bullet">•</span>
    <span className="service-text">{text}</span>
  </div>
);

export const Footer = () => {
  const services = [
    {
      column1: [
        'CONSULTORÍA Y PLANIFICACIÓN FINANCIERA',
        'VEHÍCULOS'
      ],
      column2: [
        'BIENES RAÍCES',
        'CRÉDITOS'
      ]
    }
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-main">
          {/* Sección izquierda */}
          <div className="footer-left">
            {/* Título */}
            <h2 className="footer-title">
              En <span className="highlight">MS De Valor</span> encuentras todo en un solo lugar
            </h2>
            
            {/* Contenedor de círculos y servicios */}
            <div className="circles-services-container">
              {/* Imágenes circulares */}
              <div className="circles-container">
                <CircleImage src={footerH} alt="Servicios del Hogar" />
                <CircleImage src={footerF} alt="Servicios Financieros" />
                <CircleImage src={footerC} alt="Servicios de Consultoría" />
              </div>
              
              {/* Lista de servicios */}
              <div className="services-grid">
                <div className="services-column">
                  {services[0].column1.map((service, index) => (
                    <ServiceItem key={`col1-${index}`} text={service} />
                  ))}
                </div>
                <div className="services-column">
                  {services[0].column2.map((service, index) => (
                    <ServiceItem key={`col2-${index}`} text={service} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Redes sociales e información */}
            <div className="contact-section">
              <div className="social-links">
                <SocialLink href="https://facebook.com" Icon={FaFacebook} />
                <SocialLink href="https://instagram.com" Icon={FaInstagram} />
              </div>
              
              <div className="contact-info">
                <a href="https://www.msdevalor.com" className="website-link">www.msdevalor.com</a>
                <span className="separator">•</span>
                <span>Envigado - Antioquia</span>
                <span className="separator">•</span>
                <a href="tel:+573160420188" className="phone-link">+57 316 042 01 88</a>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="logo-container">
            <Link to="/login" className="logo-link">
              <img 
                src={imglog} 
                alt="Logo MS DE VALOR" 
                className="logo-image"
              />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">
          ©2024 MS DE VALOR - TODOS LOS DERECHOS RESERVADOS
        </div>
      </div>
    </footer>
  );
};