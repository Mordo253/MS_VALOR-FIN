// PropertyEditList.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../../../context/PropertyContex'; // Asegúrate de importar el contexto adecuado

export const PropertyEditList = () => {
  const { properties, getAllProperties, deleteProperty, toggleAvailability } = useProperties();
  const navigate = useNavigate();
  
  useEffect(() => {
    getAllProperties(); // Llama a la función para obtener todas las propiedades
  }, [getAllProperties]);

  const handleEdit = (id) => {
    navigate(`/admin/property/property-update/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      await deleteProperty(id);
      getAllProperties(); // Actualiza la lista después de eliminar
    }
  };

  const handleToggleAvailability = async (property) => {
    await toggleAvailability(property._id, property.disponible);
    getAllProperties(); // Actualiza la lista después de cambiar disponibilidad
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th>Foto Portada</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(property => (
            <tr key={property._id} className="border-t">
              <td>
                <img 
                  src={property.images[0]?.secure_url || 'ruta_default.jpg'} 
                  alt="Foto portada" 
                  className="w-20 h-20 object-cover" 
                />
              </td>
              <td>{property.codigo}</td>
              <td>${property.costo.toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleToggleAvailability(property)}
                  className={`px-4 py-2 rounded ${
                    property.disponible ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {property.disponible ? 'Disponible' : 'No disponible'}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(property._id)} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(property._id)} className="px-4 py-2 bg-red-500 text-white rounded">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
