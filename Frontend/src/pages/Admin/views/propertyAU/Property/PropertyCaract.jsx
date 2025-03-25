import React, { useState, useEffect, useMemo } from "react";

const caracteristicasInternas = [
  "Admite mascotas", "Armarios Empotrados", "Baño en habitación principal",
  "Citófono / Intercomunicador", "Depósito", "Gas domiciliario",
  "Suelo de cerámica / mármol", "Zona de lavandería", "Aire acondicionado",
  "Balcón", "Biblioteca/Estudio", "Clósets", "Despensa", "Hall de alcobas",
  "Trifamiliar", "Alarma", "Baño auxiliar", "Calentador", "Cocina integral",
  "Doble Ventana", "Reformado", "Unifamiliar"
];

const caracteristicasExternas = [
  "Acceso pavimentado", "Ascensor", "Barbacoa / Parrilla / Quincho", "Cancha de futbol",
  "Circuito cerrado de TV", "Cochera / Garaje", "Gimnasio", "Oficina de negocios",
  "Patio", "Portería / Recepción", "Sistema de riego", "Trans. público cercano",
  "Vivienda unifamiliar", "Zona infantil", "Zonas verdes", "Árboles frutales",
  "Bosque nativos", "Centros comerciales", "Club House", "Colegios / Universidades",
  "Jardín", "Parqueadero visitantes", "Piscina", "Pozo de agua natural",
  "Sobre vía principal", "Urbanización Cerrada", "Zona campestre", "Zona residencial",
  "Área Social", "Cancha de baloncesto", "Cerca zona urbana", "Club Social",
  "Garaje", "Kiosko", "Parques cercanos", "Playas", "Salón Comunal", "Terraza",
  "Vigilancia", "Zona comercial", "Zonas deportivas"
];

const Caracteristicas = ({ initialSelected = { internas: [], externas: [] }, onChange }) => {
  // Estado local con validación de estructura inicial
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState(() => ({
    internas: Array.isArray(initialSelected.internas) ? initialSelected.internas : [],
    externas: Array.isArray(initialSelected.externas) ? initialSelected.externas : []
  }));

  // Función para verificar si una característica está seleccionada
  const isSelected = useMemo(() => {
    return (caracteristica, tipo) => {
      const tipoPlural = tipo === "interna" ? "internas" : "externas";
      return selectedCaracteristicas[tipoPlural].includes(caracteristica);
    };
  }, [selectedCaracteristicas]);

  // Efecto para sincronizar con props iniciales
  useEffect(() => {
    const hasChanges = JSON.stringify(initialSelected) !== JSON.stringify(selectedCaracteristicas);
    if (hasChanges) {
      setSelectedCaracteristicas({
        internas: Array.isArray(initialSelected.internas) ? initialSelected.internas : [],
        externas: Array.isArray(initialSelected.externas) ? initialSelected.externas : []
      });
    }
  }, [initialSelected]);

  // Manejador de cambios mejorado
  const handleCaracteristicaChange = (caracteristica, tipo) => {
    const tipoPlural = tipo === "interna" ? "internas" : "externas";

    setSelectedCaracteristicas(prevState => {
      const newState = {
        ...prevState,
        [tipoPlural]: prevState[tipoPlural].includes(caracteristica)
          ? prevState[tipoPlural].filter(c => c !== caracteristica)
          : [...prevState[tipoPlural], caracteristica].sort()
      };

      // Notificar cambios al componente padre
      if (onChange) {
        onChange(newState);
      }

      return newState;
    });
  };

  // Componente de checkbox mejorado
  const CaracteristicaCheckbox = ({ caracteristica, tipo }) => (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={`${tipo}-${caracteristica}`}
          checked={isSelected(caracteristica, tipo)}
          onChange={() => handleCaracteristicaChange(caracteristica, tipo)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={`${tipo}-${caracteristica}`}
          className="font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
        >
          {caracteristica}
        </label>
      </div>
    </div>
  );

  // Renderizado de grupo de características
  const renderCheckboxGroup = (caracteristicas, tipo) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {caracteristicas.map(caracteristica => (
        <CaracteristicaCheckbox
          key={`${tipo}-${caracteristica}`}
          caracteristica={caracteristica}
          tipo={tipo}
        />
      ))}
    </div>
  );

  // Debug info
  useEffect(() => {
    console.log('Características seleccionadas:', selectedCaracteristicas);
  }, [selectedCaracteristicas]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Características Internas ({selectedCaracteristicas.internas.length})
        </h3>
        {renderCheckboxGroup(caracteristicasInternas, "interna")}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Características Externas ({selectedCaracteristicas.externas.length})
        </h3>
        {renderCheckboxGroup(caracteristicasExternas, "externa")}
      </div>
    </div>
  );
};

export default Caracteristicas;