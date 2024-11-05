import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bath, Bed, Car, Square } from "lucide-react";
import { Button } from "@material-tailwind/react";

export const Item = ({ 
  _id,
  title,
  codigo,
  images,
  zona,
  ciudad,
  departamento,
  pais,
  description,
  alcobas,
  banos,
  garaje,
  areaTerreno,
  costo,
  tipoInmueble
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

  // Función para formatear la ubicación
  const formatLocation = () => {
    const fields = [zona, ciudad, departamento, pais]
      .filter(isValidField)
      .join(', ');
    return fields || "Ubicación no disponible";
  };

  // Función para formatear el título
  const formatTitle = () => {
    const parts = [tipoInmueble, ciudad, zona]
      .filter(isValidField);
    return parts.join(' - ');
  };

  // Función para filtrar características con valor
  const getValidFeatures = () => {
    const features = [
      { icon: <Bed className="w-4 h-4 text-gray-500 shrink-0" />, value: alcobas },
      { icon: <Bath className="w-4 h-4 text-gray-500 shrink-0" />, value: banos },
      { icon: <Car className="w-4 h-4 text-gray-500 shrink-0" />, value: garaje },
      { icon: <Square className="w-4 h-4 text-gray-500 shrink-0" />, value: areaTerreno, suffix: 'm²' }
    ];

    return features.filter(feature => isValidField(feature.value));
  };

  const validFeatures = getValidFeatures();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="relative w-full pt-[70%]">
        <img
          src={images?.[0]?.secure_url || "/api/placeholder/400/300"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {isValidField(tipoInmueble) && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {tipoInmueble}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h5 className="text-green-500 font-semibold line-clamp-1 mb-1">
          {formatLocation()}
        </h5>
        
        <h4 className="font-bold text-lg mb-2 line-clamp-1">
          {formatTitle()}
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
            {costo ? `$${costo.toLocaleString()}` : 'Precio no disponible'}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {codigo ? `${codigo.toLocaleString()}` : 'Código no disponible'}
          </span>
          <Button 
            onClick={() => navigate(`/properties/${_id}`)}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
};