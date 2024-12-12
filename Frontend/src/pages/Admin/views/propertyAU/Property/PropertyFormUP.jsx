import React, { useState, useEffect } from 'react';

const PropertyFormUP = ({ initialData, onChange, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? Number(value) || '' : value;

    const updatedData = { ...formData, [name]: newValue };
    setFormData(updatedData);
    onChange?.(updatedData);
  };

  const FormInput = ({ label, name, type = 'text', ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        {...props}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const FormSelect = ({ label, name, options, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        {...props}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Actualizar Propiedad</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campos de texto generales */}
        <FormInput label="Título" name="title" required placeholder="Ingrese el título de la propiedad" />
        <FormInput label="Código" name="codigo" placeholder="Código de la propiedad" />
        <FormInput label="País" name="pais" required placeholder="Ingrese el país" />
        <FormInput label="Departamento" name="departamento" required placeholder="Ingrese el departamento" />
        <FormInput label="Ciudad" name="ciudad" required placeholder="Ingrese la ciudad" />
        <FormInput label="Zona" name="zona" required placeholder="Ingrese la zona" />

        {/* Campos numéricos */}
        <FormInput label="Área Construida (m²)" name="areaConstruida" type="number" min="0" step="0.01" required placeholder="0.00" />
        <FormInput label="Área del Terreno (m²)" name="areaTerreno" type="number" min="0" step="0.01" required placeholder="0.00" />
        <FormInput label="Área Privada (m²)" name="areaPrivada" type="number" min="0" step="0.01" required placeholder="0.00" />
        <FormInput label="Alcobas" name="alcobas" type="number" min="0" required placeholder="Número de alcobas" />
        <FormInput label="Baños" name="banos" type="number" min="0" required placeholder="Número de baños" />
        <FormInput label="Garajes" name="garaje" type="number" min="0" required placeholder="Número de garajes" />
        <FormInput label="Piso" name="piso" type="number" min="0" required placeholder="Número de piso" />
        <FormInput label="Estrato" name="estrato" type="number" min="1" max="6" required placeholder="Estrato (1-6)" />
        <FormInput label="Costo" name="costo" type="number" min="0" step="1000" required placeholder="Valor de la propiedad" />

        {/* Selects */}
        <FormSelect
          label="Tipo de Inmueble"
          name="tipoInmueble"
          options={["Casa", "Apartamento", "Local", "Oficina", "Bodega", "Lote", "Finca"]}
          required
        />
        <FormSelect
          label="Tipo de Negocio"
          name="tipoNegocio"
          options={["Venta", "Arriendo", "Arriendo/Venta"]}
          required
        />
        <FormSelect
          label="Estado"
          name="estado"
          options={["Nuevo", "Usado", "En construcción", "Sobre planos", "Remodelado"]}
          required
        />

        {/* Otros campos */}
        <FormInput label="Valor Administración" name="valorAdministracion" type="number" min="0" step="1000" required placeholder="Valor de la administración" />
        <FormInput
          label="Año de Construcción"
          name="anioConstruccion"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          required
          placeholder="Año de construcción"
        />
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
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
              checked={formData.disponible || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="disponible" className="text-sm font-medium text-gray-700 cursor-pointer">
              Disponible para {formData.tipoNegocio?.toLowerCase() || 'venta/arriendo'}
            </label>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default PropertyFormUP;