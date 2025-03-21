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
  DoorOpen,
  Car,
  Building, 
  ChevronLeft,
  ChevronRight,
  Star,
  Share2,
  Check,
  Maximize2
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
import defaultImg from "../../assets/Default_avatar.jpeg";
import angImg from "../../assets/Angela_Rua.jpg";
import jfImg  from "../../assets/WebJFG.png";
import CMimg  from "../../assets/WebCM.png";
import MetaTags from '../../components/ui/Otter/MetaTags';
import AgentProfile from '../../components/Team/AgentProfile';
import ElegantImageViewer from '../../components/ui/Otter/Imagezoom';

//Miembros
const teamMembers = [
  {
    name: 'Juan Fernando González',
    role: 'Director',
    image: `../${jfImg}`,
    phone: '3122259584',
    WhatsApp: 'https://wa.me/573122259584?text=Hola Juan Fernando, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Claudia González',
    role: 'Agente Inmobiliaria',
    image: `../${defaultImg}`,
    phone: '3160420188',
    WhatsApp: 'https://wa.me/573160420188?text=Hola MS de Valor, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Carolina Montoya',
    role: 'Agente Inmobiliaria',
    image: `../${CMimg}`,
    phone: '3187084726',
    WhatsApp: 'https://wa.me/573160420188?text=Hola MS de Valor, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Angela Rua',
    role: 'Agente Inmobiliaria',
    image: `../${angImg}`,
    phone: '3117046773',
    WhatsApp: 'https://wa.me/573160420188?text=Hola MS de Valor, estoy interesad@ en lo que ofrece MS De Valor',
  },
];
// Funciones auxiliares
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

// Función optimizada para imágenes de Cloudinary
const getOptimizedImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  let fullUrl = imageUrl;
  if (!imageUrl.startsWith('http')) {
    fullUrl = imageUrl.startsWith('//') ? 
      `https:${imageUrl}` : 
      `https://${imageUrl}`;
  }

  if (fullUrl.includes('cloudinary')) {
    return fullUrl.replace(
      '/upload/',
      '/upload/w_1200,h_630,c_fill/'
    );
  }

  return fullUrl;
};
// Componentes auxiliares
const PropertyDetail = ({ icon, label, value }) => {
  if (shouldHideValue(value)) return null;
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
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
    <div 
      className="p-2 rounded-full transition-transform hover:scale-110" 
      style={{ backgroundColor: color }}
    >
      <IconComponent 
        size={20} 
        round 
        bgStyle={{ fill: 'transparent' }} 
        iconFillColor="white" 
      />
    </div>
  </ShareButtonComponent>
);

const CustomShareButton = ({ property, mainImageUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: `${property.title} - ${property.codigo}`,
      text: property.description || `${property.tipoInmueble} en ${property.ciudad}`,
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors w-full"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span>Compartir enlace</span>
        </>
      )}
    </button>
  );
};

const DetailItem = ({ label, value }) => {
  if (shouldHideValue(value)) return null;
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

// Componente principal
export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [userSelected, setUserSelected] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [arrowTimeout, setArrowTimeout] = useState(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Preparar URL de imagen optimizada
  const mainImageUrl2 = property?.images[0]?.secure_url || "";
  const optimizedImageUrl = getOptimizedImageUrl(mainImageUrl2);
  const mainImageUrl = property?.images[mainImageIndex]?.secure_url;

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
    if (property?.images.length > 1 && !userSelected) {
      interval = setInterval(() => {
        setMainImageIndex(prev => 
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [property, userSelected]);

  useEffect(() => {
    return () => {
      if (arrowTimeout) clearTimeout(arrowTimeout);
    };
  }, [arrowTimeout]);

  useEffect(() => {
    if (optimizedImageUrl) {
      const img = new Image();
      img.src = optimizedImageUrl;
      img.onload = () => {
        console.log('Imagen cargada correctamente:', optimizedImageUrl);
      };
      img.onerror = () => {
        console.error('Error al cargar la imagen:', optimizedImageUrl);
      };
    }
  }, [optimizedImageUrl]);

  const handleImageClick = (index) => {
    setMainImageIndex(index);
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  const handleTouchStart = () => {
    setShowArrows(true);
    if (arrowTimeout) clearTimeout(arrowTimeout);

    const timeout = setTimeout(() => {
      setShowArrows(false);
    }, 3000);

    setArrowTimeout(timeout);
  };

  const changeMainImage = (direction) => {
    if (!property?.images?.length) return;

    setMainImageIndex(prev => {
      if (direction === 'left') {
        return prev === 0 ? property.images.length - 1 : prev - 1;
      }
      return prev === property.images.length - 1 ? 0 : prev + 1;
    });
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      Cargando propiedad...
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      {error}
    </div>
  );
  
  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      No se encontró la propiedad.
    </div>
  );

  const caracteristicasInternas = property.caracteristicas
    .filter(caract => caract.type === 'interna')
    .map(caract => caract.name);

  const caracteristicasExternas = property.caracteristicas
    .filter(caract => caract.type === 'externa')
    .map(caract => caract.name);

  const location = formatLocation(
    property.zona, 
    property.ciudad, 
    property.departamento
  );

  const title = `${property.title} - ${property.codigo}`;
  const description = property.description || `${property.tipoInmueble} en ${property.ciudad}`;
  const imageUrl = property.images.length > 0 ? property.images[0].secure_url : '/default-image.jpg';
  const url = window.location.href;

return (
  <>
    <MetaTags
      title={title}
      description={description}
      imageUrl={imageUrl}
      url={url}
    />
      
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-16 lg:pt-12 xl:pt-16 2xl:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grid de tres columnas en pantallas grandes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna izquierda: Perfil del agente */}
            <div className="lg:col-span-3">
              {(() => {
                const agent = teamMembers.find(m => m.name === property.creador);
                return agent ? (
                  <div className="bg-white rounded-xl shadow-sm sticky top-24">
                    <AgentProfile agent={agent} />
                  </div>
                ) : null;
              })()}
            </div>

            {/* Columna central: Galería */}
            <div className="lg:col-span-6 space-y-4">
            <div
              className="relative h-[600px] bg-gray-200 rounded-xl overflow-hidden group"
              onTouchStart={handleTouchStart}
              onMouseEnter={() => setShowArrows(true)}
              onMouseLeave={() => setShowArrows(false)}
            >
              <img
                src={mainImageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Botón de zoom */}
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg 
                          hover:bg-white transition-all duration-300
                          opacity-0 group-hover:opacity-100"
              >
                <Maximize2 size={24} />
              </button>

              {/* Botones de navegación existentes */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeMainImage('left');
                }}
                className={`
                  absolute left-4 top-1/2 -translate-y-1/2 
                  bg-white/90 rounded-full p-2 shadow-lg 
                  hover:bg-white transition-all duration-300
                  lg:opacity-100
                  ${showArrows ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeMainImage('right');
                }}
                className={`
                  absolute right-4 top-1/2 -translate-y-1/2 
                  bg-white/90 rounded-full p-2 shadow-lg 
                  hover:bg-white transition-all duration-300
                  lg:opacity-100
                  ${showArrows ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <ElegantImageViewer
              isOpen={isZoomModalOpen}
              onClose={() => setIsZoomModalOpen(false)}
              images={property.images}
              currentImageIndex={mainImageIndex}
              onImageChange={setMainImageIndex}
            />

              {/* Miniaturas */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {property.images.map((image, index) => (
                  <button
                    key={image.secure_url || index}
                    onClick={() => handleImageClick(index)}
                    className={`
                      flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden 
                      transition-all duration-200
                      ${index === mainImageIndex ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
                    `}
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

            {/* Columna derecha: Información del inmueble */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                {/* Botón volver */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Volver</span>
                  </button>
                </div>

                {/* Título y código */}
                <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                <p className="text-lg font-semibold text-gray-600 mb-4">{property.codigo}</p>

                {/* Ubicación */}
                {location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={18} />
                    <span>{location}</span>
                  </div>
                )}

                {/* Precio */}
                <div className="text-3xl font-bold mb-6 flex items-center text-blue-600">
                  <DollarSign size={28} />
                  <span>{property.costo.toLocaleString()}</span>
                </div>

                {/* Características principales */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <PropertyDetail icon={<Home />} label="Habitaciones" value={property.alcobas} />
                  <PropertyDetail icon={<Bath />} label="Baños" value={property.banos} />
                  <PropertyDetail icon={<Ruler />} label="Área Total" value={property.areaTerreno && `${property.areaTerreno}m²`} />
                  <PropertyDetail icon={<Building />} label="Área Construida" value={property.areaConstruida && `${property.areaConstruida}m²`} />
                  <PropertyDetail icon={<Car />} label="Garajes" value={property.garaje} />
                  <PropertyDetail icon={<Star />} label="Estrato" value={property.estrato} />
                  <PropertyDetail icon={<DoorOpen />} label="Cuartos Utiles" value={property.useful_room} />
                </div>

                {/* Botones de contacto y compartir */}
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                    Contactar al vendedor
                  </Button>

                  <a
                    href={`https://wa.me/573160420188?text=Hola MS DE VALOR, estoy interesado en la propiedad ${property.codigo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600 py-3">
                      Contactar por WhatsApp
                    </Button>
                  </a>

                  <CustomShareButton 
                    property={property} 
                    mainImageUrl={optimizedImageUrl} 
                  />

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

          {/* Contenido adicional debajo del grid principal */}
           {/* Descripción y detalles adicionales */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Descripción */}
                {property.description && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Descripción</h2>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}
    
                {/* Detalles adicionales */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Detalles adicionales</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
                <h2 className="text-xl font-bold mb-6">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Características internas */}
                  {caracteristicasInternas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Internas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {caracteristicasInternas
                        .filter(caracteristica => !shouldHideValue(caracteristica))
                        .map((caracteristica) => (
                            <div key={caracteristica} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                              <span className="text-gray-700">{caracteristica}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
  
                  {/* Características externas */}
                  {caracteristicasExternas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Externas</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {caracteristicasExternas
                          .filter(caracteristica => !shouldHideValue(caracteristica))
                          .map((caracteristica) => (
                              <div key={caracteristica} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                              <span className="text-gray-700">{caracteristica}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Videos */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
              <h2 className="text-xl font-semibold mb-6">Videos de la Propiedad</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.videos && property.videos.length > 0 ? (
                property.videos.map((video) => (
                  <div key={video.public_id} className="relative group">
                    <iframe
                      className="w-full h-48 rounded-lg"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={`Video ${video.id}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))
              ) : (
                <p>No hay videos disponibles para esta propiedad.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PropertyDetails;