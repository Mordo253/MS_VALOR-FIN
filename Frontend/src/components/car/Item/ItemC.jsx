import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Fuel, GitFork } from "lucide-react";
import { Button } from "@material-tailwind/react";

export const Item = ({
  _id,
  car,
  price,
  codigo,
  images,
  color,
  registrationYear,
  fuel,
  kilometer,
  doors,
  brand,
  model,
  tractionType,
  description
}) => {
  const navigate = useNavigate();

  const isValidField = (value) => {
    return value && 
           value !== 'NA' && 
           value !== 'N/A' && 
           value !== '-' &&
           value !== 0 &&
           value !== '0' &&
           value.toString().toLowerCase() !== 'na';
  };

  const getValidFeatures = () => {
    const features = [
      { 
        icon: <Car className="w-4 h-4 text-gray-500" />, 
        value: kilometer, 
        suffix: ' km' 
      },
      { 
        icon: <Fuel className="w-4 h-4 text-gray-500" />, 
        value: fuel 
      },
      { 
        icon: <GitFork className="w-4 h-4 text-gray-500" />, 
        value: tractionType 
      }
    ];

    return features.filter(feature => isValidField(feature.value));
  };

  const validFeatures = getValidFeatures();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
      {/* Image Container with fixed aspect ratio */}
      <div className="relative aspect-[4/3]">
        <img
          src={images?.[0]?.secure_url || "/api/placeholder/400/300"}
          alt={car}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div>
          <div className="text-green-600 font-medium">
            {brand} {registrationYear}
          </div>
          <h2 className="text-xl font-bold">
            {car || `${model}`}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Specifications Grid */}
        {validFeatures.length > 0 && (
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
            {validFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                {feature.icon}
                <span className="text-sm">
                  {feature.value}{feature.suffix || ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Price and Action Section */}
        <div className="space-y-3">
          <div className="text-2xl font-bold text-gray-900">
            {price ? `$${price.toLocaleString()}` : 'Precio no disponible'}
          </div>
          <div className="text-sm text-gray-600">
            {codigo ? `Código: ${codigo}` : 'Código no disponible'}
          </div>
          <Button 
            onClick={() => navigate(`/cars/${_id}`)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
          >
            VER DETALLES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Item;