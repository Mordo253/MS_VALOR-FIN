import React, { useState, useEffect } from 'react';

const CarForm = ({ initialData, onChange, isSubmitting }) => {
  const [carData, setCarData] = useState({
    title: "",
    car: "",
    price: "",
    kilometer: "",
    color: "",
    registrationYear: "",
    change: "",
    tractionType: "",
    brand: "",
    model: "",
    place: "",
    door: "",
    fuel: "",
    description: "",
    disponible: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setCarData(initialData);
    }
  }, [initialData]);

  const validateField = (name, value) => {
    // Asegurarse de que value no sea undefined o null
    if (value === undefined || value === null) {
      value = '';
    }

    // Convertir a string para campos que requieren trim()
    const stringValue = String(value);

    switch (name) {
      case 'title':
      case 'brand':
      case 'color':
        return stringValue.trim() === '' ? 'Este campo es requerido' : '';
      case 'model':
        if (!value) return 'El modelo es requerido';
        const modelNum = parseInt(value);
        return isNaN(modelNum) ? 'Modelo inválido' : '';
      case 'registrationYear':
        if (!value) return 'El año es requerido';
        const yearNum = parseInt(value);
        return isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()
          ? 'Año inválido'
          : '';
      case 'fuel':
        return stringValue === '' ? 'Seleccione una opción' : '';
      case 'change':
        return stringValue === '' ? 'Seleccione una opción' : '';
      case 'door':
        if (!value) return 'Número de puertas requerido';
        const puertasNum = parseInt(value);
        return isNaN(puertasNum) || puertasNum < 2 || puertasNum > 5
          ? 'Número de puertas debe estar entre 2 y 5'
          : '';
      case 'kilometer':
        if (!value) return 'Kilometraje requerido';
        const kmNum = parseInt(value);
        return isNaN(kmNum) || kmNum < 0
          ? 'Kilometraje debe ser positivo'
          : '';
      case 'price':
        if (!value) return 'Precio requerido';
        const priceNum = parseInt(value);
        return isNaN(priceNum) || priceNum <= 0
          ? 'El precio debe ser mayor a 0'
          : '';
      case 'description':
        return stringValue.trim().length < 10
          ? 'La descripción debe tener al menos 10 caracteres'
          : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(carData).forEach(key => {
      if (key !== 'disponible' && key !== 'car' && key !== 'place' && key !== 'tractionType') {
        const error = validateField(key, carData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const updatedData = {
      ...carData,
      [name]: newValue,
    };

    const fieldError = validateField(name, newValue);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    setCarData(updatedData);

    // Solo enviar al padre si no hay errores
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      onChange(updatedData);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    return `${baseClasses} ${
      touched[fieldName] && errors[fieldName]
        ? "border-red-500 bg-red-50"
        : "border-gray-300"
    }`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Información del Vehículo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Anuncio</label>
          <input
            type="text"
            id="title"
            name="title"
            value={carData.title || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Ingrese un título descriptivo"
            className={getInputClassName("title")}
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Marca */}
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={carData.brand || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Marca del vehículo"
            className={getInputClassName("brand")}
          />
          {touched.brand && errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>

        {/* TIPO DE CARRO */}
        <div className="mb-4">
          <label htmlFor="car" className="block text-sm font-medium text-gray-700">Tipo carro</label>
          <input
            type="text"
            id="car"
            name="car"
            value={carData.car || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Tipo de vehículo"
            className={getInputClassName("car")}
          />
          {touched.car && errors.car && (
            <p className="mt-1 text-sm text-red-600">{errors.car}</p>
          )}
        </div>

        {/* Modelo */}
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="number"
            id="model"
            name="model"
            value={carData.model || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Modelo del vehículo"
            className={getInputClassName("model")}
          />
          {touched.model && errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
          )}
        </div>

        {/* Año */}
        <div className="mb-4">
          <label htmlFor="registrationYear" className="block text-sm font-medium text-gray-700">Año</label>
          <input
            type="number"
            id="registrationYear"
            name="registrationYear"
            value={carData.registrationYear || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1900"
            max={new Date().getFullYear()}
            required
            placeholder="Año del vehículo"
            className={getInputClassName("registrationYear")}
          />
          {touched.registrationYear && errors.registrationYear && (
            <p className="mt-1 text-sm text-red-600">{errors.registrationYear}</p>
          )}
        </div>

        {/* Combustible */}
        <div className="mb-4">
          <label htmlFor="fuel" className="block text-sm font-medium text-gray-700">
            Tipo de Combustible
          </label>
          <select
            id="fuel"
            name="fuel"
            value={carData.fuel || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={getInputClassName("fuel")}
          >
            <option value="">Seleccione una opción</option>
            {["Gasolina", "Diésel", "Eléctrico", "Híbrido"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {touched.fuel && errors.fuel && (
            <p className="mt-1 text-sm text-red-600">{errors.fuel}</p>
          )}
        </div>

        {/* Transmisión */}
        <div className="mb-4">
          <label htmlFor="change" className="block text-sm font-medium text-gray-700">
            Transmisión
          </label>
          <select
            id="change"
            name="change"
            value={carData.change || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={getInputClassName("change")}
          >
            <option value="">Seleccione una opción</option>
            {["Manual", "Automática"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {touched.change && errors.change && (
            <p className="mt-1 text-sm text-red-600">{errors.change}</p>
          )}
        </div>

        {/* tractionType */}
        <div className="mb-4">
          <label htmlFor="tractionType" className="block text-sm font-medium text-gray-700">
            Tracción
          </label>
          <select
            id="tractionType"
            name="tractionType"
            value={carData.tractionType || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={getInputClassName("tractionType")}
          >
            <option value="">Seleccione una opción</option>
            {["Trasera", "Delantera", "4x4", "AWD"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {touched.tractionType && errors.tractionType && (
            <p className="mt-1 text-sm text-red-600">{errors.tractionType}</p>
          )}
        </div>

        {/* Puertas */}
        <div className="mb-4">
          <label htmlFor="door" className="block text-sm font-medium text-gray-700">
            Número de Puertas
          </label>
          <input
            type="number"
            id="door"
            name="door"
            value={carData.door || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="2"
            max="5"
            required
            placeholder="Número de puertas"
            className={getInputClassName("door")}
          />
          {touched.door && errors.door && (
            <p className="mt-1 text-sm text-red-600">{errors.door}</p>
          )}
        </div>

        {/* Kilometraje */}
        <div className="mb-4">
          <label htmlFor="kilometer" className="block text-sm font-medium text-gray-700">
            Kilometraje
          </label>
          <input
            type="number"
            id="kilometer"
            name="kilometer"
            value={carData.kilometer || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            required
            placeholder="Kilometraje actual"
            className={getInputClassName("kilometer")}
          />
          {touched.kilometer && errors.kilometer && (
            <p className="mt-1 text-sm text-red-600">{errors.kilometer}</p>
          )}
        </div>

        {/* Color */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={carData.color || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Color del vehículo"
            className={getInputClassName("color")}
          />
          {touched.color && errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color}</p>
          )}
        </div>

        {/* Precio */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={carData.price || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            step="1000"
            required
            placeholder="Precio del vehículo"
            className={getInputClassName("price")}
          />
          {touched.price && errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-4 col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={carData.description || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            required
            placeholder="Describa las características principales del vehículo..."
            className={getInputClassName("description")}
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Disponible */}
        <div className="col-span-2">
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="disponible"
              name="disponible"
              checked={carData.disponible}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="disponible" className="text-sm font-medium text-gray-700 cursor-pointer">
              Disponible para venta/arriendo
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

export default CarForm;