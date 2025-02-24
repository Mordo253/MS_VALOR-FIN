import React, { useState, useEffect } from "react";

const PropertyFormUP = ({ initialData, onChange, isSubmitting, isUpdate = false }) => {
  const [propertyData, setPropertyData] = useState({
    title: "",
    pais: "",
    departamento: "",
    ciudad: "",
    zona: "",
    areaConstruida: "",
    areaTerreno: "",
    areaPrivada: "",
    alcobas: "",
    costo: "",
    banos: "",
    garaje: "",
    estrato: "",
    piso: "",
    tipoInmueble: "",
    tipoNegocio: "",
    estado: "",
    disponible: true,
    valorAdministracion: "",
    anioConstruccion: "",
    useful_room: "",
    description: "",
    creador: "",
    propietario: "",
  });

  useEffect(() => {
    if (initialData) {
      setPropertyData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const updatedData = {
      ...propertyData,
      [name]: newValue,
    };

    setPropertyData(updatedData);
    onChange(updatedData);
  };

  return (
     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Datos de la Propiedad</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campos básicos */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={propertyData.title}
            onChange={handleChange}
            required
            placeholder="Ingrese el título de la propiedad"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pais" className="block text-sm font-medium text-gray-700">País</label>
          <input
            type="text"
            id="pais"
            name="pais"
            value={propertyData.pais}
            onChange={handleChange}
            required
            placeholder="Ingrese el país"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            value={propertyData.departamento}
            onChange={handleChange}
            required
            placeholder="Ingrese el departamento"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={propertyData.ciudad}
            onChange={handleChange}
            required
            placeholder="Ingrese la ciudad"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="zona" className="block text-sm font-medium text-gray-700">Zona</label>
          <input
            type="text"
            id="zona"
            name="zona"
            value={propertyData.zona}
            onChange={handleChange}
            required
            placeholder="Ingrese la zona"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Campos numéricos */}
        <div className="mb-4">
          <label htmlFor="areaConstruida" className="block text-sm font-medium text-gray-700">Área Construida (m²)</label>
          <input
            type="number"
            id="areaConstruida"
            name="areaConstruida"
            value={propertyData.areaConstruida}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="areaTerreno" className="block text-sm font-medium text-gray-700">Área del Terreno (m²)</label>
          <input
            type="number"
            id="areaTerreno"
            name="areaTerreno"
            value={propertyData.areaTerreno}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="areaPrivada" className="block text-sm font-medium text-gray-700">Área Privada (m²)</label>
          <input
            type="number"
            id="areaPrivada"
            name="areaPrivada"
            value={propertyData.areaPrivada}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="alcobas" className="block text-sm font-medium text-gray-700">Alcobas</label>
          <input
            type="number"
            id="alcobas"
            name="alcobas"
            value={propertyData.alcobas}
            onChange={handleChange}
            min="0"
            required
            placeholder="Número de alcobas"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="alcobas" className="block text-sm font-medium text-gray-700">Cuartos Utiles</label>
          <input
            type="number"
            id="useful_room"
            name="useful_room"
            value={propertyData.useful_room}
            onChange={handleChange}
            min="0"
            required
            placeholder="Número de cuartos utiles"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="banos" className="block text-sm font-medium text-gray-700">Baños</label>
          <input
            type="number"
            id="banos"
            name="banos"
            value={propertyData.banos}
            onChange={handleChange}
            min="0"
            required
            placeholder="Número de baños"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="garaje" className="block text-sm font-medium text-gray-700">Garajes</label>
          <input
            type="number"
            id="garaje"
            name="garaje"
            value={propertyData.garaje}
            onChange={handleChange}
            min="0"
            required
            placeholder="Número de garajes"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="piso" className="block text-sm font-medium text-gray-700">Piso</label>
          <input
            type="number"
            id="piso"
            name="piso"
            value={propertyData.piso}
            onChange={handleChange}
            min="0"
            required
            placeholder="Número de piso"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="estrato" className="block text-sm font-medium text-gray-700">Estrato</label>
          <input
            type="number"
            id="estrato"
            name="estrato"
            value={propertyData.estrato}
            onChange={handleChange}
            min="1"
            max="6"
            required
            placeholder="Estrato (1-6)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="costo" className="block text-sm font-medium text-gray-700">Costo</label>
          <input
            type="number"
            id="costo"
            name="costo"
            value={propertyData.costo}
            onChange={handleChange}
            min="0"
            step="1000"
            required
            placeholder="Valor de la propiedad"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Selects */}
        <div className="mb-4">
          <label htmlFor="tipoInmueble" className="block text-sm font-medium text-gray-700">Tipo de Inmueble</label>
          <select
            id="tipoInmueble"
            name="tipoInmueble"
            value={propertyData.tipoInmueble}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una opción</option>
            {["Casa", "Apartamento", "Local", "Oficina", "Bodega", "Lote", "Finca, Apartaestudio, Casa campestre"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="tipoNegocio" className="block text-sm font-medium text-gray-700">Tipo de Negocio</label>
          <select
            id="tipoNegocio"
            name="tipoNegocio"
            value={propertyData.tipoNegocio}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una opción</option>
            {["Venta", "Arriendo", "Arriendo/Venta"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            id="estado"
            name="estado"
            value={propertyData.estado}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una opción</option>
            {["Nuevo", "Usado", "En construcción", "Sobre planos", "Remodelado"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="valorAdministracion" className="block text-sm font-medium text-gray-700">
            Valor Administración
          </label>
          <input
            type="number"
            id="valorAdministracion"
            name="valorAdministracion"
            value={propertyData.valorAdministracion}
            onChange={handleChange}
            min="0"
            step="1000"
            required
            placeholder="Valor de la administración"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="anioConstruccion" className="block text-sm font-medium text-gray-700">
            Año de Construcción
          </label>
          <input
            type="number"
            id="anioConstruccion"
            name="anioConstruccion"
            value={propertyData.anioConstruccion}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            required
            placeholder="Año de construcción"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

          {/* Campo de Creador (solo en creación) */}
          {!isUpdate && (
          <div className="mb-4">
            <label htmlFor="creador" className="block text-sm font-medium text-gray-700">
              Creador
            </label>
            <select
              type="text"
              id="creador"
              name="creador"
              value={propertyData.creador}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una opción</option>
            {["Carolina Montoya", "Claudia González", "Angela Rua", "Juan Fernando González"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            </select>

          </div>
        )}

        {/* Campo de Propietario */}
        <div className="mb-4">
          <label htmlFor="propietario" className="block text-sm font-medium text-gray-700">
            Propietario
          </label>
          <input
            type="text"
            id="propietario"
            name="propietario"
            value={propertyData.propietario}
            onChange={handleChange}
            required
            placeholder="Ingrese el nombre del propietario"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label><textarea
            id="description"
            name="description"
            value={propertyData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Describa las características principales de la propiedad..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="disponible"
              name="disponible"
              checked={propertyData.disponible}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="disponible" className="text-sm font-medium text-gray-700 cursor-pointer">
              Disponible para {propertyData.tipoNegocio?.toLowerCase() || 'venta/arriendo'}
            </label>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default PropertyFormUP;