import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../../../../context/CarContext'; // Asegúrate de importar el contexto adecuado
 
export const CarEditList = () => {
  const { vehicles, getAllVehicles, deleteVehicle, toggleAvailability } = useVehicles();
  const navigate = useNavigate();
  
  useEffect(() => {
    getAllVehicles(); // Llama a la función para obtener todos los vehículos
  }, [getAllVehicles]);

  const handleEdit = (id) => {
    navigate(`/admin/car/car-update/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      await deleteVehicle(id);
      getAllVehicles(); // Actualiza la lista después de eliminar
    }
  };

  const handleToggleAvailability = async (vehicle) => {
    await toggleAvailability(vehicle._id, vehicle.disponible);
    getAllVehicles(); // Actualiza la lista después de cambiar disponibilidad
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
          {vehicles.map(vehicle => (
            <tr key={vehicle._id} className="border-t">
              <td>
                <img 
                  src={vehicle.images[0]?.secure_url || 'ruta_default.jpg'} 
                  alt="Foto portada" 
                  className="w-20 h-20 object-cover" 
                />
              </td>
              <td>{vehicle.codigo}</td>
              <td>${vehicle.price.toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleToggleAvailability(vehicle)}
                  className={`px-4 py-2 rounded ${vehicle.disponible ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                >
                  {vehicle.disponible ? 'Disponible' : 'No disponible'}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(vehicle._id)} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(vehicle._id)} className="px-4 py-2 bg-red-500 text-white rounded">
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
