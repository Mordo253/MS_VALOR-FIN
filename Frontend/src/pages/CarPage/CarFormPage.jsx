import React, { useState } from 'react';
import { useVehicles } from '../../context/CarContext'; // Importar el contexto

export const CarFormPage = () => {
  const { createVehicle } = useVehicles(); // Usar la función createVehicle del contexto
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

      // Llamar a la función del contexto para crear el vehículo
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
      }); // Limpiar el formulario después de la creación exitosa
    } catch (error) {
      setError('Error al crear el vehículo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Car:</label>
        <input
          type="text"
          name="car"
          value={formData.car}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Kilometer:</label>
        <input
          type="number"
          name="kilometer"
          value={formData.kilometer}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Color:</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Registration Year:</label>
        <input
          type="text"
          name="registrationYear"
          value={formData.registrationYear}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Change (Transmisión):</label>
        <input
          type="text"
          name="change"
          value={formData.change}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Traction Type:</label>
        <input
          type="text"
          name="tractionType"
          value={formData.tractionType}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Model:</label>
        <input
          type="number"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Place:</label>
        <input
          type="number"
          name="place"
          value={formData.place}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Door:</label>
        <input
          type="number"
          name="door"
          value={formData.door}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Fuel:</label>
        <input
          type="text"
          name="fuel"
          value={formData.fuel}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <div>
        <label>Images:</label>
        <input
          type="file"
          name="images"
          onChange={handleImageChange}
          multiple
          accept="image/*"
        />
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Vehículo creado con éxito!</p>}
      <button type="submit" disabled={loading}>Create Vehicle</button>
    </form>
  );
};