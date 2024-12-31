import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

const Settings = () => {
  const { user, changePassword, errors } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordErrors, setChangePasswordErrors] = useState([]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Verificar si las contraseñas nuevas coinciden
    if (newPassword !== confirmPassword) {
      setChangePasswordErrors(['Las nuevas contraseñas no coinciden']);
      return;
    }

    // Llamar a la función de cambio de contraseña desde el contexto
    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      setChangePasswordErrors([]); // Limpiar errores
      alert('Contraseña cambiada correctamente');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Ajustes</h1>

      {/* Información del usuario */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-700">Información de usuario</h3>
        <p className="text-gray-600"><strong>Nombre de usuario:</strong> {user?.username}</p>
        <p className="text-gray-600"><strong>Correo electrónico:</strong> {user?.email}</p>
      </div>

      {/* Sección para cambiar la contraseña */}
      <div>
        <h3 className="text-xl font-medium text-gray-700 mb-4">Cambiar contraseña</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Contraseña actual</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Mostrar errores de cambio de contraseña */}
          {changePasswordErrors && (
            <div className="text-red-500 text-sm">
              {changePasswordErrors.join(', ')}
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>

      {/* Mostrar errores globales (si los hay) */}
      {Array.isArray(errors) && errors.length > 0 && (
        <div className="mt-4 text-red-500 text-sm">
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
};

export default Settings;