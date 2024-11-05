import { FaFacebook, FaInstagram } from 'react-icons/fa';
import footerF from '../../assets/footerF.jpg';
import footerC from '../../assets/footerC.jpg';
import footerH from '../../assets/footerH.jpg';
import imglog from "../../assets/MS5.png";
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black to-[#737373] text-white py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mx-auto max-w-5xl">
        
        {/* Columna izquierda: Texto y secciones */}
        <div className="text-center md:text-left md:flex-1 mb-6 md:mb-0">
          {/* Título */}
          <div className="text-2xl font-semibold text-gray-100 mb-4">
            En <span className="text-[#b4a160]">MS De Valor</span> encuentras todo en un solo lugar
          </div>
          
          {/* Imágenes en círculo */}
          <div className="flex justify-center md:justify-start space-x-6 mb-4">
            {[footerH, footerF, footerC].map((image, index) => (
              <div key={index} className="w-24 h-24 rounded-full border-4 border-[#b4a160] overflow-hidden flex items-center justify-center">
                <img src={image} alt="Icon" className="w-full h-full object-cover" />
              </div>
            ))}

             {/* Descripción corta */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 text-sm font-medium text-gray-300 mb-4 gap-4">
            <p className='flex flex-col items-baseline text-sm gap-4'>
              <span>• CONSULTORÍA Y PLANIFICACIÓN FINANCIERA</span>
              <span>• VEHÍCULOS</span>
            </p>
            <p className='flex flex-col items-baseline text-sm gap-4'>
              <span>• BIENES RAÍCES</span>
              <span>• CRÉDITOS</span>
            </p>
          </div>
          </div>

         
          
          {/* Redes sociales */}
          <div className="flex justify-center md:justify-start space-x-4 text-[#b4a160] text-2xl mb-2">
            <FaFacebook />
            <FaInstagram />
          </div>

          {/* Información de contacto */}
          <div className="text-gray-400 text-sm">
            <Link to="/" className="text-[#b4a160] hover:underline">www.msdevalor.com</Link>
            <span> • Envigado - Antioquia</span>
            <span> • +57 316 042 01 88</span>
            <br />
            <span className='flex items-end'> ©2024 MS DE VALOR - TODOS LOS DERECHOS RESERVADOS</span>
          </div>
        </div>
        
        {/* Columna derecha: Logo */}
        <div className="pub flex items-center justify-center md:justify-end md:flex-none">
          <Link to="/" className="flex items-center">
            <img src={imglog} alt="Logo MS DE VALOR" className="w-52 h-52 object-contain" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
