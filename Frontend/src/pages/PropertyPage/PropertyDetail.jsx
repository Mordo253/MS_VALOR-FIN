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
  Star,
  Share2,
  Check
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

// Utilidades
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

// Componentes de detalle
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

// Componente ShareButton actualizado
const ShareButton = ({ component: ShareButtonComponent, icon: IconComponent, color, property }) => {
  const shareUrl = window.location.href;
  const mainImageUrl = property.images[0]?.secure_url;
  const shareTitle = `${property.title} - ${property.codigo}`;
  const shareDescription = property.description || `${property.tipoInmueble} en ${property.ciudad}`;
  const priceFormatted = property.costo.toLocaleString();
  const locationFormatted = `${property.zona}, ${property.ciudad}, ${property.departamento}`;

  // Mensajes personalizados por plataforma
  const customMessages = {
    facebook: `${shareTitle}\n${shareDescription}\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}`,
    twitter: `${shareTitle} - MS DE VALOR`,
    whatsapp: `¡Mira esta propiedad!\n\n${shareTitle}\n${shareDescription}\n\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}\n\nMás información:`,
    email: `${shareTitle}\n\n${shareDescription}\n\nPrecio: $${priceFormatted}\nUbicación: ${locationFormatted}\n\nVer más detalles en:`
  };

  return (
    <ShareButtonComponent 
      url={shareUrl}
      title={shareTitle}
      description={shareDescription}
      quote={customMessages.facebook}
      subject={`Propiedad ${property.codigo} - MS DE VALOR`}
      body={customMessages.email}
      image={mainImageUrl}
      hashtag="#MSDeValor"
      via="msdevalor"
    >
      <div className="p-2 rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color }}>
        <IconComponent size={20} round bgStyle={{ fill: 'transparent' }} iconFillColor="white" />
      </div>
    </ShareButtonComponent>
  );
};

// Componente CustomShareButton actualizado
const CustomShareButton = ({ property }) => {
  const [copied, setCopied] = useState(false);
  const mainImageUrl = property.images[0]?.secure_url;
  const shareUrl = window.location.href;
  const priceFormatted = property.costo.toLocaleString();

  useEffect(() => {
    const updateMetaTags = () => {
      // Limpiar meta tags existentes
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="keywords"]')
        .forEach(tag => tag.remove());

      // Configurar meta tags
      const metaTags = [
        // Meta tags básicos
        { name: 'description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { name: 'author', content: 'MS DE VALOR' },
        { name: 'keywords', content: `${property.tipoInmueble}, ${property.ciudad}, ${property.zona}, inmuebles, propiedades` },
        
        // Open Graph / Facebook
        { property: 'og:url', content: shareUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${property.title} - ${property.codigo}` },
        { property: 'og:description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { property: 'og:image', content: mainImageUrl },
        { property: 'og:image:secure_url', content: mainImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: property.title },
        { property: 'og:site_name', content: 'MS DE VALOR' },
        { property: 'og:price:amount', content: priceFormatted },
        { property: 'og:price:currency', content: 'COP' },
        { property: 'og:locale', content: 'es_CO' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@msdevalor' },
        { name: 'twitter:creator', content: '@msdevalor' },
        { name: 'twitter:title', content: `${property.title} - ${property.codigo}` },
        { name: 'twitter:description', content: property.description || `${property.tipoInmueble} en ${property.ciudad}` },
        { name: 'twitter:image', content: mainImageUrl },
        { name: 'twitter:image:alt', content: property.title },
        
        // WhatsApp específico
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:locale', content: 'es_LA' }
      ];

      // Crear y añadir meta tags
      metaTags.forEach(({ property, name, content }) => {
        if (!content) return;
        
        const meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        if (name) meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });
    };

    updateMetaTags();
    return () => {
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="keywords"]')
        .forEach(tag => tag.remove());
    };
  }, [property, mainImageUrl, shareUrl, priceFormatted]);

  const handleShare = async () => {
    const shareData = {
      title: `${property.title} - ${property.codigo}`,
      text: `${property.description || `${property.tipoInmueble} en ${property.ciudad}`}\nPrecio: $${priceFormatted}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors w-full"
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

      <div className="flex justify-center gap-4 pt-4">
        <ShareButton component={FacebookShareButton} icon={FacebookIcon} color="#1877F2" property={property} />
        <ShareButton component={TwitterShareButton} icon={TwitterIcon} color="#1DA1F2" property={property} />
        <ShareButton component={WhatsappShareButton} icon={WhatsappIcon} color="#25D366" property={property} />
        <ShareButton component={EmailShareButton} icon={EmailIcon} color="#D44638" property={property} />
      </div>
    </div>
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
        setMainImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [property, userSelected]);

  useEffect(() => {
    return () => {
      if (arrowTimeout) clearTimeout(arrowTimeout);
    };
  }, [arrowTimeout]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando propiedad...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">No se encontró la propiedad.</div>;

  const caracteristicasInternas = property.caracteristicas
    .filter(caract => caract.type === 'interna')
    .map(caract => caract.name);

  const caracteristicasExternas = property.caracteristicas
    .filter(caract => caract.type === 'externa')
    .map(caract => caract.name);

  const location = formatLocation(property.zona, property.ciudad, property.departamento);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-16 lg:pt-12 xl:pt-16 2xl:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Image Gallery Section */}
          <div className="lg:col-span-8 space-y-4">
            <div
              className="relative h-[600px] bg-gray-200 rounded-xl overflow-hidden"
              onTouchStart={handleTouchStart}
              onMouseEnter={() => setShowArrows(true)}
              onMouseLeave={() => setShowArrows(false)}
            >
              <img
                src={property.images[mainImageIndex]?.secure_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
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

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {property.images.map((image, index) => (
                <button
                  key={index}
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

          {/* Property Info Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Volver</span>
                </button>
              </div>
              <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
              <p className="text-lg font-semibold text-gray-600 mb-4">{property.codigo}</p>

              {location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{location}</span>
                </div>
              )}

              <div className="text-3xl font-bold mb-6 flex items-center text-blue-600">
                <DollarSign size={28} />
                <span>{property.costo.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <PropertyDetail icon={<Home />} label="Habitaciones" value={property.alcobas} />
                <PropertyDetail icon={<Bath />} label="Baños" value={property.banos} />
                <PropertyDetail icon={<Ruler />} label="Área Total" value={property.areaTerreno && `${property.areaTerreno}m²`} />
                <PropertyDetail icon={<Building />} label="Área Construida" value={property.areaConstruida && `${property.areaConstruida}m²`} />
                <PropertyDetail icon={<Car />} label="Garajes" value={property.garaje} />
                <PropertyDetail icon={<Star />} label="Estrato" value={property.estrato} />
              </div>

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

                <CustomShareButton property={property} />

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

        {/* Description and Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {property.description && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          )}

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
              {caracteristicasInternas.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Internas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caracteristicasInternas
                      .filter(caracteristica => !shouldHideValue(caracteristica))
                      .map((caracteristica, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="text-gray-700">{caracteristica}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {caracteristicasExternas.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Externas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caracteristicasExternas
                      .filter(caracteristica => !shouldHideValue(caracteristica))
                      .map((caracteristica, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
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
      </div>
    </div>
  );
};

export default PropertyDetails;