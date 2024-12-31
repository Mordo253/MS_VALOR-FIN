import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { loginRequest, verifyTokenRequest, changePasswordRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Función de inicio de sesión
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      setErrors(error.response?.data?.message || ['An error occurred during login']);
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para cambiar la contraseña
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await changePasswordRequest(oldPassword, newPassword);
      setErrors([]); // Limpiar errores
      setUser((prevUser) => ({
        ...prevUser,
        // Aquí podrías actualizar el estado del usuario si es necesario
      }));
      return true; // Si todo sale bien
    } catch (error) {
      console.log(error);
      setErrors(error.response?.data?.message || ['An error occurred while changing password']);
      return false;
    }
  };

  // Verificar si el usuario está autenticado (revisar cookie de token)
  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest();
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signin,
        logout,
        changePassword,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
