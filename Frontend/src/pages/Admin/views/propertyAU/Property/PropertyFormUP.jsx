import React, { useState, useEffect } from "react";
import { useProperties } from "../../../../../context/PropertyContex";

const PropertyFormUP = ({ propertyId }) => {
  const { getProperty } = useProperties();
  const [propertyData, setPropertyData] = useState({
    title: "",
    codigo: "",
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
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los datos iniciales de la propiedad
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        const response = await getProperty(propertyId);
        if (response && response.data) {
          setPropertyData({
            title: response.data.title || "",
            codigo: response.data.codigo || "",
            pais: response.data.pais || "",
            departamento: response.data.departamento || "",
            ciudad: response.data.ciudad || "",
            zona: response.data.zona || "",
            areaConstruida: response.data.areaConstruida || "",
            areaTerreno: response.data.areaTerreno || "",
            areaPrivada: response.data.areaPrivada || "",
            alcobas: response.data.alcobas || "",
            costo: response.data.costo || "",
            banos: response.data.banos || "",
            garaje: response.data.garaje || "",
            estrato: response.data.estrato || "",
            piso: response.data.piso || "",
            tipoInmueble: response.data.tipoInmueble || "",
            tipoNegocio: response.data.tipoNegocio || "",
            estado: response.data.estado || "",
            disponible: response.data.disponible || true,
            valorAdministracion: response.data.valorAdministracion || "",
            anioConstruccion: response.data.anioConstruccion || "",
            description: response.data.description || "",
          });
        }
      } catch (err) {
        setError("Error al cargar los datos de la propiedad.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, [propertyId, getProperty]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Actualizar Propiedad</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Título */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={propertyData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Código */}
      {/* <div className="mb-4">
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
        <input
          type="text"W
          id="codigo"
          name="codigo"
          value={propertyData.codigo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div> */}

      {/* País */}
      <div className="mb-4">
        <label htmlFor="pais" className="block text-sm font-medium text-gray-700">País</label>
        <input
          type="text"
          id="pais"
          name="pais"
          value={propertyData.pais}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Departamento */}
      <div className="mb-4">
        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
        <input
          type="text"
          id="departamento"
          name="departamento"
          value={propertyData.departamento}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Ciudad */}
      <div className="mb-4">
        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
        <input
          type="text"
          id="ciudad"
          name="ciudad"
          value={propertyData.ciudad}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Zona */}
      <div className="mb-4">
        <label htmlFor="zona" className="block text-sm font-medium text-gray-700">Zona</label>
        <input
          type="text"
          id="zona"
          name="zona"
          value={propertyData.zona}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Área construida */}
      <div className="mb-4">
        <label htmlFor="areaConstruida" className="block text-sm font-medium text-gray-700">Área Construida (m²)</label>
        <input
          type="number"
          id="areaConstruida"
          name="areaConstruida"
          value={propertyData.areaConstruida}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Área del terreno */}
      <div className="mb-4">
        <label htmlFor="areaTerreno" className="block text-sm font-medium text-gray-700">Área del Terreno (m²)</label>
        <input
          type="number"
          id="areaTerreno"
          name="areaTerreno"
          value={propertyData.areaTerreno}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Área privada */}
      <div className="mb-4">
        <label htmlFor="areaPrivada" className="block text-sm font-medium text-gray-700">Área Privada (m²)</label>
        <input
          type="number"
          id="areaPrivada"
          name="areaPrivada"
          value={propertyData.areaPrivada}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Alcobas */}
      <div className="mb-4">
        <label htmlFor="alcobas" className="block text-sm font-medium text-gray-700">Alcobas</label>
        <input
          type="number"
          id="alcobas"
          name="alcobas"
          value={propertyData.alcobas}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Costo */}
      <div className="mb-4">
        <label htmlFor="costo" className="block text-sm font-medium text-gray-700">Costo</label>
        <input
          type="number"
          id="costo"
          name="costo"
          value={propertyData.costo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Baños */}
      <div className="mb-4">
        <label htmlFor="banos" className="block text-sm font-medium text-gray-700">Baños</label>
        <input
          type="number"
          id="banos"
          name="banos"
          value={propertyData.banos}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Garaje */}
      <div className="mb-4">
        <label htmlFor="garaje" className="block text-sm font-medium text-gray-700">Garaje</label>
        <input
          type="number"
          id="garaje"
          name="garaje"
          value={propertyData.garaje}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Estrato */}
      <div className="mb-4">
        <label htmlFor="estrato" className="block text-sm font-medium text-gray-700">Estrato</label>
        <input
          type="number"
          id="estrato"
          name="estrato"
          value={propertyData.estrato}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Piso */}
      <div className="mb-4">
        <label htmlFor="piso" className="block text-sm font-medium text-gray-700">Piso</label>
        <input
          type="number"
          id="piso"
          name="piso"
          value={propertyData.piso}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tipo de Inmueble */}
      <div className="mb-4">
        <label htmlFor="tipoInmueble" className="block text-sm font-medium text-gray-700">Tipo de Inmueble</label>
        <input
          type="text"
          id="tipoInmueble"
          name="tipoInmueble"
          value={propertyData.tipoInmueble}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tipo de Negocio */}
      <div className="mb-4">
        <label htmlFor="tipoNegocio" className="block text-sm font-medium text-gray-700">Tipo de Negocio</label>
        <input
          type="text"
          id="tipoNegocio"
          name="tipoNegocio"
          value={propertyData.tipoNegocio}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Estado */}
      <div className="mb-4">
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
        <input
          type="text"
          id="estado"
          name="estado"
          value={propertyData.estado}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Valor de Administración */}
      <div className="mb-4">
        <label htmlFor="valorAdministracion" className="block text-sm font-medium text-gray-700">Valor de Administración</label>
        <input
          type="number"
          id="valorAdministracion"
          name="valorAdministracion"
          value={propertyData.valorAdministracion}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Año de Construcción */}
      <div className="mb-4">
        <label htmlFor="anioConstruccion" className="block text-sm font-medium text-gray-700">Año de Construcción</label>
        <input
          type="number"
          id="anioConstruccion"
          name="anioConstruccion"
          value={propertyData.anioConstruccion}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={propertyData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      {/* Disponible */}
      <div className="mb-4">
        <label htmlFor="disponible" className="block text-sm font-medium text-gray-700">Disponible</label>
        <input
          type="checkbox"
          id="disponible"
          name="disponible"
          checked={propertyData.disponible}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PropertyFormUP;
