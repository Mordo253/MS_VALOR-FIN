import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../../context/CarContext';
import { Button } from "@material-tailwind/react";
import {
  ArrowLeft,
  MapPin,
  Car,
  DollarSign,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Calendar,
  Gauge,
  Palette,
  Cog,
  Fuel,
  DoorOpen,
  Users,
  X
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
import AdvancedTooltip from '../../components/ui/Tooltips/AdvancedTooltip';
import defaultImg from "../../assets/Default_avatar.jpeg";
import angImg from "../../assets/Angela_Rua.jpg";
import jfImg  from "../../assets/Juan_Fernando.png";

//Miembros
const teamMembers = [
  {
    name: 'Juan Fernando González',
    role: 'Director',
    image: `../${jfImg}`,
    bio: 'Lorem ipsum, dolor sit amet consect',
    WhatsApp: 'https://wa.me/573122259584?text=Hola Juan Fernando, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Claudia González',
    role: 'Asesora financiera',
    image: `../${defaultImg}`,
    bio: 'Lorem ipsum, dolor sit amet consect',
    WhatsApp: 'https://wa.me/573160420188?text=Hola Claudia, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Carolina Montoya',
    role: 'Asesora financiera',
    image: `../${defaultImg}`,
    bio: 'Lorem ipsum, dolor sit amet consect',
    WhatsApp: 'https://wa.me/573160420188?text=Hola Claudia, estoy interesad@ en lo que ofrece MS De Valor',
  },
  {
    name: 'Angela Rua',
    role: 'Asesora financiera',
    image: `../${angImg}`,
    bio: 'Lorem ipsum, dolor sit amet consect',
    WhatsApp: 'https://wa.me/573160420188?text=Hola Claudia, estoy interesad@ en lo que ofrece MS De Valor',
  },
];

const shouldHideValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && value === 0) return true;
  if (typeof value === 'string' && value.toString().toLowerCase() === 'na') return true;
  return false;
};

const formatLocation = (city, state) => {
  return [city, state]
    .filter(item => !shouldHideValue(item))
    .join(', ');
};

const CarDetail = ({ icon, label, value }) => {
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
    <div className="p-2 rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color }}>
      <IconComponent size={20} round bgStyle={{ fill: 'transparent' }} iconFillColor="white" />
    </div>
  </ShareButtonComponent>
);

const CustomShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl
        });
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

export const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicle } = useVehicles();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [userSelected, setUserSelected] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [arrowTimeout, setArrowTimeout] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carData = await getVehicle(id);
        setCar(carData.data);
      } catch (error) {
        setError('Error al cargar el automóvil.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, getVehicle]);

  useEffect(() => {
    let interval;
    if (car?.images?.length > 1 && !userSelected) {
      interval = setInterval(() => {
        setMainImageIndex(prev => prev === car.images.length - 1 ? 0 : prev + 1);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [car, userSelected]);

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
    if (!car?.images?.length) return;

    setMainImageIndex(prev => {
      if (direction === 'left') {
        return prev === 0 ? car.images.length - 1 : prev - 1;
      }
      return prev === car.images.length - 1 ? 0 : prev + 1;
    });
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando automóvil...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center">No se encontró el automóvil.</div>;

  const location = formatLocation(car.city, car.state);

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
                src={car.images[mainImageIndex]?.secure_url}
                alt={car.title}
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
              {car.images.map((image, index) => (
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
                    alt={`${car.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Info Section */}
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
              {/* Título y código */}
              <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
                  {(() => {
                    const member = teamMembers.find(m => m.name === car.creador);
                    
                    if (member) {
                      return (
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
                          <p className="text-lg font-semibold text-gray-600 mb-4">{car.codigo}</p>
                        </AdvancedTooltip>
                      );
                    }
                    return null;
                  })()}


              {/* Availability Status */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  car.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {car.disponible ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Disponible</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>No Disponible</span>
                    </>
                  )}
                </span>
              </div>

              {location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{location}</span>
                </div>
              )}

              <div className="text-3xl font-bold mb-6 flex items-center text-blue-600">
                <DollarSign size={28} />
                <span>{car.price?.toLocaleString()}</span>
              </div>

              {/* Extended Car Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <CarDetail icon={<Car />} label="Marca" value={car.brand} />
                <CarDetail icon={<Car />} label="Modelo" value={car.model} />
                <CarDetail icon={<Car />} label="Tipo" value={car.car} />
                <CarDetail icon={<Gauge />} label="Kilometraje" value={car.kilometer} />
                <CarDetail icon={<Palette />} label="Color" value={car.color} />
                <CarDetail icon={<Calendar />} label="Año de registro" value={car.registrationYear} />
                <CarDetail icon={<Cog />} label="Transmisión" value={car.change} />
                <CarDetail icon={<Car />} label="Tracción" value={car.tractionType} />
                <CarDetail icon={<Fuel />} label="Combustible" value={car.fuel} />
                <CarDetail icon={<DoorOpen />} label="Puertas" value={car.door} />
                <CarDetail icon={<Users />} label="Capacidad" value={`${car.place} personas`} />
              </div>

              {/* Contact and Share Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  Contactar al vendedor
                </Button>

                <a
                  href={`https://wa.me/573160420188?text=Hola, estoy interesado en el automóvil ${car.codigo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 py-3">
                    Contactar por WhatsApp
                  </Button>
                </a>

                <CustomShareButton />

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

        {/* Description Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold mb-4">Descripción</h2>
          <p className="text-gray-700 leading-relaxed">{car.description}</p>
        </div>

        {/* Videos */}
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
              <h2 className="text-xl font-semibold mb-6">Videos del vehículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.videos && car.videos.length > 0 ? (
                  car.videos.map((video) => (
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
                  <p>No hay videos disponibles para este vehículo.</p>
                )}
              </div>
            </div>
      </div>
    </div>
  );
};

export default CarDetails;