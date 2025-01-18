import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

// Función de registro
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('📝 Datos de registro recibidos:', { 
      username, 
      email,
      passwordLength: password.length 
    });

    // Verificar si el correo ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({
        message: ["El correo electrónico ya está en uso"],
      });

    // Crear nuevo usuario - el hash se hará automáticamente en el pre-save
    const newUser = new User({
      username,
      email,
      password // La contraseña se hasheará automáticamente
    });

    // Guardar el usuario
    const userSaved = await newUser.save();
    console.log('💾 Usuario guardado:', {
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email
    });

    // Crear el token de acceso
    const token = await createAccessToken({
      id: userSaved._id,
    });

    // Configurar la cookie con el token
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      token,
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: error.message });
  }
};

// Función de login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Intento de login:', { 
      email,
      passwordLength: password.length 
    });

    // Buscar el usuario por correo
    const userFound = await User.findOne({ email });
    console.log('🔍 Usuario encontrado:', userFound ? {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email
    } : null);

    if (!userFound)
      return res.status(400).json({
        message: ["El correo electrónico no existe"],
      });

    // Usar el método comparePassword del modelo
    const isMatch = await userFound.comparePassword(password);
    console.log('🔐 Resultado de comparación:', isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: ["La contraseña es incorrecta"],
      });
    }

    // Crear el token de acceso
    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

    // Configurar la cookie con el token
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      token,
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Función para verificar el token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    console.log('Usuario ID:', req.user.id);
    console.log('Usuario encontrado:', !!user);
    console.log('Contraseña actual:', oldPassword);

    const isValid = await user.comparePassword(oldPassword);
    console.log('Contraseña válida:', isValid);

    if (!isValid) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: error.message });
  }
};