import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

// Función para registrar un usuario
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el correo ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({
        message: ["El correo electrónico ya está en uso"],
      });

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Guardar el usuario en la base de datos
    const userSaved = await newUser.save();

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

    // Responder con los datos del usuario y el token
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      token, // Devolver el token también
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por correo
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({
        message: ["El correo electrónico no existe"],
      });

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, userFound.password);
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

    // Responder con los datos del usuario y el token
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      token, // Devolver el token también
    });
  } catch (error) {
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