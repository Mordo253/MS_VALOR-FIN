import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContex';
import { Button } from "@material-tailwind/react";
import { 
  ArrowLeft, 
  MapPin, 
  Home,   
  DollarSign, 
  Ruler, 
  Bath, 
  Car, 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon 
} from 'react-share';

// Utility functions remain the same
const shouldHideValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && value === 0) return true;
  if (typeof value === 'string' && value.toString().toLowerCase() === 'na') return true;
  return false;
};

const formatLocation = (zona, ciudad, departamento) => {
  return [zona, ciudad, departamento]
    .filter(item => !shouldHideValue(item))
    .join(', ');
};

// Components remain the same
const PropertyDetail = ({ icon, label, value }) => {
  if (shouldHideValue(value)) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {React.cloneElement(icon, { size: 16 })}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

const ShareButton = ({ component: ShareButtonComponent, icon: IconComponent, color }) => (
  <ShareButtonComponent url={window.location.href}>
    <div className="p-1 rounded-full" style={{ backgroundColor: color }}>
      <IconComponent size={18} round bgStyle={{ fill: 'transparent' }} iconFillColor="white" />
    </div>
  </ShareButtonComponent>
);

const DetailItem = ({ label, value }) => {
  if (shouldHideValue(value)) {
    return null;
  }

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

export const PropertyDetails = () => {
  // ... State and effects remain the same ...
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [userSelected, setUserSelected] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await getProperty(id);
        setProperty(propertyData.data);
      } catch (error) {
        setError('Error al cargar la propiedad.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, getProperty]);

  useEffect(() => {
    let interval;
    if (property && property.images.length > 1 && !userSelected) {
      interval = setInterval(() => {
        setMainImageIndex((prevIndex) => 
          prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [property, userSelected]);

  const handleImageClick = (index) => {
    setMainImageIndex(index);
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  const changeMainImage = (direction) => {
    setMainImageIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex === 0 ? property.images.length - 1 : prevIndex - 1;
      }
      return prevIndex === property.images.length - 1 ? 0 : prevIndex + 1;
    });
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center pt-20 pb-32">
        <div>Cargando propiedad...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center pt-20 pb-32">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center pt-20 pb-32">
        <div>No se encontró la propiedad.</div>
      </div>
    );
  }

  // Filter características by type
  const caracteristicasInternas = property.caracteristicas
    .filter(caract => caract.type === 'interna')
    .map(caract => caract.name);

  const caracteristicasExternas = property.caracteristicas
    .filter(caract => caract.type === 'externa')
    .map(caract => caract.name);

  const location = formatLocation(property.zona, property.ciudad, property.departamento);

  return (
    <div className="min-h-screen bg-white pt-20 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 relative top-10"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96">
              <div className="relative w-full h-full">
                <img 
                  src={property.images[mainImageIndex]?.secure_url}
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => changeMainImage('left')} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => changeMainImage('right')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    index === mainImageIndex 
                      ? 'ring-2 ring-blue-500' 
                      : 'hover:ring-2 hover:ring-blue-300'
                  }`}
                >
                  <img
                    src={image.secure_url}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
              <h1 className="text-2xl font-bold mb-2">{property.codigo}</h1>
              {location && (
                <div className="flex items-center gap-1 text-gray-600 mb-2 text-sm">
                  <MapPin size={16} />
                  <span>{location}</span>
                </div>
              )}
              
              <div className="text-3xl font-bold mb-6 flex items-center text-blue-600">
                <DollarSign size={24} />
                <span>{property.costo.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <PropertyDetail icon={<Home />} label="Habitaciones" value={property.alcobas} />
                <PropertyDetail icon={<Bath />} label="Baños" value={property.banos} />
                <PropertyDetail icon={<Ruler />} label="Área Total" value={property.areaTerreno && `${property.areaTerreno}m²`} />
                <PropertyDetail icon={<Building />} label="Área Construida" value={property.areaConstruida && `${property.areaConstruida}m²`} />
                <PropertyDetail icon={<Car />} label="Garajes" value={property.garaje} />
                <PropertyDetail icon={<Star />} label="Estrato" value={property.estrato} />
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contactar al vendedor
                </Button>
                
                <a 
                  href={`https://wa.me/573160420188?text=Hola MS DE VALOR, estoy interesado en la propiedad ${property.title}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Contactar por WhatsApp
                  </Button>
                </a>
                
                <div className="flex justify-center gap-4 pt-4">
                  <ShareButton component={FacebookShareButton} icon={FacebookIcon} color="#1877F2" />
                  <ShareButton component={TwitterShareButton} icon={TwitterIcon} color="#1DA1F2" />
                  <ShareButton component={WhatsappShareButton} icon={WhatsappIcon} color="#25D366" />
                  <ShareButton component={EmailShareButton} icon={EmailIcon} color="#D44638" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción y Detalles adicionales */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {property.description && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Detalles adicionales</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Tipo de inmueble" value={property.tipoInmueble} />
              <DetailItem label="Tipo de negocio" value={property.tipoNegocio} />
              <DetailItem label="Estado" value={property.estado} />
              <DetailItem 
                label="Administración" 
                value={property.valorAdministracion && property.valorAdministracion > 0 ? 
                  `$${property.valorAdministracion.toLocaleString()}` : null} 
              />
              <DetailItem label="Año de construcción" value={property.anioConstruccion} />
              <DetailItem label="Piso" value={property.piso} />
            </div>
          </div>
        </div>

        {/* Características */}
        {(caracteristicasInternas.length > 0 || caracteristicasExternas.length > 0) && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Características</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caracteristicasInternas.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Internas</h3>
                  <ul className="space-y-2">
                    {caracteristicasInternas
                      .filter(caracteristica => !shouldHideValue(caracteristica))
                      .map((caracteristica, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"/>
                          <span className="text-gray-700">{caracteristica}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              {caracteristicasExternas.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Externas</h3>
                  <ul className="space-y-2">
                    {caracteristicasExternas
                      .filter(caracteristica => !shouldHideValue(caracteristica))
                      .map((caracteristica, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"/>
                          <span className="text-gray-700">{caracteristica}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>  
          </div>
        )}
      </div>
    </div>
  );
}