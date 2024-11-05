import React, { useState } from 'react';
import { useVehicles } from '../../../../context/CarContext';

export const Carform = () => {
  const { createVehicle } = useVehicles();
  const [formData, setFormData] = useState({
    car: '',
    price: '',
    kilometer: '',
    color: '',
    registrationYear: '',
    change: '',
    tractionType: '',
    brand: '',
    model: '',
    place: '',
    door: '',
    fuel: '',
    description: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData[key].forEach((image) => {
            formDataToSubmit.append('images', image);
          });
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await createVehicle(formDataToSubmit);
      setSuccess(true);
      setFormData({
        car: '',
        price: '',
        kilometer: '',
        color: '',
        registrationYear: '',
        change: '',
        tractionType: '',
        brand: '',
        model: '',
        place: '',
        door: '',
        fuel: '',
        description: '',
        images: [],
      });
    } catch (error) {
      setError('Error al crear el vehículo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Vehículo</h2>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { name: 'car', label: 'Car', type: 'text' },
                { name: 'price', label: 'Price', type: 'number' },
                { name: 'kilometer', label: 'Kilometer', type: 'number' },
                { name: 'color', label: 'Color', type: 'text' },
                { name: 'registrationYear', label: 'Registration Year', type: 'text' },
                { name: 'change', label: 'Change (Transmisión)', type: 'text' },
                { name: 'tractionType', label: 'Traction Type', type: 'text' },
                { name: 'brand', label: 'Brand', type: 'text' },
                { name: 'model', label: 'Model', type: 'number' },
                { name: 'place', label: 'Place', type: 'number' },
                { name: 'door', label: 'Door', type: 'number' },
                { name: 'fuel', label: 'Fuel', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label 
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-gray-300 border px-4 py-2 text-gray-900 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             shadow-sm transition-colors duration-200"
                  />
                </div>
              ))}
            </div>

            <div>
              <label 
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="block w-full rounded-md border-gray-300 border px-4 py-2 text-gray-900
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         shadow-sm transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-700">¡Vehículo creado con éxito!</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  'Crear Vehículo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};