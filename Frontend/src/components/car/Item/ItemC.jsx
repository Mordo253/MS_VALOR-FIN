import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Square } from "lucide-react"; // Ajuste de iconos
import { Button } from "@material-tailwind/react";

export const Item = ({
  _id,
  car, // Nombre del coche
  price, // Precio del coche
  codigo, // Código único del vehículo
  images, // Imágenes del vehículo
  color, // Color del vehículo
  registrationYear, // Año de registro
  fuel, // Tipo de combustible
  kilometer, // Kilometraje
  doors, // Número de puertas
  brand, // Marca del vehículo
  model, // Modelo del vehículo
  tractionType, // Tipo de tracción
  description // Descripción del vehículo
}) => {
  const navigate = useNavigate();

  // Función para validar si un campo tiene valor
  const isValidField = (value) => {
    return value && 
           value !== 'NA' && 
           value !== 'N/A' && 
           value !== '-' &&
           value !== 0 &&
           value !== '0' &&
           value.toString().toLowerCase() !== 'na';
  };

  // Función para filtrar características con valor
  const getValidFeatures = () => {
    const features = [
      { icon: <Square className="w-4 h-4 text-gray-500 shrink-0" />, value: kilometer, suffix: ' km' },
      { icon: <span className="text-gray-500">combustible</span>, value: fuel },
      { icon: <span className="text-gray-500">Tracción</span>, value: tractionType }
    ];

    return features.filter(feature => isValidField(feature.value));
  };

  // Filtrar características únicas (sin duplicados)
  const validFeatures = getValidFeatures();


  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="relative w-full pt-[70%]">
        <img
          src={images?.[0]?.secure_url || "/api/placeholder/400/300"}
          alt={car}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h5 className="text-green-500 font-semibold line-clamp-1 mb-1">
          {brand} {model} - {registrationYear}
        </h5>
        
        <h4 className="font-bold text-lg mb-2 line-clamp-1">
          {car}
        </h4>
        
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {validFeatures.length > 0 && (
          <div className="flex items-center justify-around py-3 border-y border-gray-100 mb-4">
            {validFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-1.5 px-1">
                {feature.icon}
                <span className="text-sm">
                  {feature.value}{feature.suffix || ''}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-4">
          <span className="text-2xl font-bold text-gray-900">
            {price ? `$${price.toLocaleString()}` : 'Precio no disponible'}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {codigo ? `Código: ${codigo}` : 'Código no disponible'}
          </span>
          <Button 
            onClick={() => navigate(`/cars/${_id}`)}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
};
