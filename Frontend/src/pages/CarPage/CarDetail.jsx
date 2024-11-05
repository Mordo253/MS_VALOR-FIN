import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '../../context/CarContext';
import { Button } from "@material-tailwind/react";
import { 
  ArrowLeft, 
  Car, 
  DollarSign, 
  Ruler, 
  Star, 
  ChevronLeft, 
  ChevronRight 
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

const CarDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-1">
    {React.cloneElement(icon, { size: 16 })}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

const ShareButton = ({ component: ShareButtonComponent, icon: IconComponent, color }) => (
  <ShareButtonComponent url={window.location.href}>
    <div className="p-1 rounded-full" style={{ backgroundColor: color }}>
      <IconComponent size={18} round bgStyle={{ fill: 'transparent' }} iconFillColor="white" />
    </div>
  </ShareButtonComponent>
);

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicle } = useVehicles();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [userSelected, setUserSelected] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleData = await getVehicle(id);
        setVehicle(vehicleData.data);
      } catch (error) {
        setError('Error al cargar el vehículo.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id, getVehicle]);

  useEffect(() => {
    let interval;
    if (vehicle && vehicle.images.length > 1 && !userSelected) {
      interval = setInterval(() => {
        setMainImageIndex((prevIndex) => 
          prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [vehicle, userSelected]);

  const handleImageClick = (index) => {
    setMainImageIndex(index);
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  const changeMainImage = (direction) => {
    setMainImageIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1;
      }
    });
    setUserSelected(true);
    setTimeout(() => setUserSelected(false), 40000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center pt-20 pb-32">
        <div>Cargando vehículo...</div>
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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center pt-20 pb-32">
        <div>No se encontró el vehículo.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  src={vehicle.images[mainImageIndex]?.secure_url}
                  alt={vehicle.car} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => changeMainImage('left')} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => changeMainImage('right')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-6 gap-2">
              {vehicle.images.map((image, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer aspect-square"
                  onClick={() => handleImageClick(index)}
                >
                  <img 
                    src={image.secure_url} 
                    alt={`${vehicle.car} - ${index + 1}`} 
                    className={`w-full h-full object-cover rounded-md ${
                      index === mainImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-2">{vehicle.car}</h1>
              
              <div className="text-3xl font-bold mb-6 flex items-center text-blue-600">
                <DollarSign size={24} />
                <span>{vehicle.price.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <CarDetail icon={<Car />} label="Modelo" value={vehicle.model} />
                <CarDetail icon={<Star />} label="Tipo de tracción" value={vehicle.tractionType} />
                <CarDetail icon={<Ruler />} label="Kilómetros" value={`${vehicle.kilometer} km`} />
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contactar al vendedor
                </Button>
                
                <a 
                  href={`https://wa.me/573160420188?text=Hola MS DE VALOR, estoy interesado en el vehículo ${vehicle.model} - ${vehicle.brand}-${vehicle.car}`} 
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
        
        {/* Descripción */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Descripción</h2>
          <p className="text-gray-700">{vehicle.description}</p>
        </div>
      </div>
    </div>
  );
}