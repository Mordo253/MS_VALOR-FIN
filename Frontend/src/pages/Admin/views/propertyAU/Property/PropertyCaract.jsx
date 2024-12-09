import React, { useState, useEffect } from "react";

const caracteristicasInternas = [
  "Admite mascotas", "Armarios Empotrados", "Baño en habitación principal",
  "Citófono / Intercomunicador", "Depósito", "Gas domiciliario",
  "Suelo de cerámica / mármol", "Zona de lavandería", "Aire acondicionado",
  "Balcón", "Biblioteca/Estudio", "Clósets", "Despensa", "Hall de alcobas",
  "Trifamiliar", "Alarma", "Baño auxiliar", "Calentador", "Cocina integral",
  "Doble Ventana", "Reformado", "Unifamiliar"
];

const caracteristicasExternas = [
  "Acceso pavimentado", "Barbacoa / Parrilla / Quincho", "Cancha de futbol",
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
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState(initialSelected);

  // Asegurarse de que el componente reciba los valores iniciales correctamente
  useEffect(() => {
    setSelectedCaracteristicas(initialSelected);
  }, [initialSelected]);

  // Manejo de cambios en las características
  const handleCaracteristicaChange = (caracteristica, tipo) => {
    const tipoKey = tipo === "interna" ? "internas" : "externas";

    setSelectedCaracteristicas((prev) => {
      const updated = prev[tipoKey].includes(caracteristica)
        ? prev[tipoKey].filter((c) => c !== caracteristica) // Eliminar
        : [...prev[tipoKey], caracteristica]; // Agregar

      const newState = { ...prev, [tipoKey]: updated };
      if (onChange) onChange(newState); // Llamamos a onChange para propagar el cambio
      return newState;
    });
  };

  // Renderizar los checkboxes para un grupo
  const renderCheckboxGroup = (caracteristicas, tipo) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {caracteristicas.map((caracteristica) => (
        <div key={caracteristica} className="flex items-center">
          <input
            type="checkbox"
            id={`${tipo}-${caracteristica}`}
            checked={selectedCaracteristicas[tipo]?.includes(caracteristica) || false} // Verificar si la característica está seleccionada
            onChange={() => handleCaracteristicaChange(caracteristica, tipo)} // Llamar la función para manejar el cambio
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor={`${tipo}-${caracteristica}`}
            className="ml-2 block text-sm text-gray-700"
          >
            {caracteristica}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Características Internas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Características Internas</h3>
        {renderCheckboxGroup(caracteristicasInternas, "interna")}
      </div>

      {/* Características Externas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Características Externas</h3>
        {renderCheckboxGroup(caracteristicasExternas, "externa")}
      </div>
    </div>
  );
};

export default Caracteristicas;
