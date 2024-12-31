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

// Función para cambiar la contraseña
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    // Obtener el usuario del token (el usuario ya está en req.user debido al middleware 'auth')
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la contraseña actual coincide con la almacenada
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // Verificar si la nueva contraseña es diferente a la actual
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "La nueva contraseña no puede ser la misma que la anterior" });
    }

    // Hashear la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    user.password = newPasswordHash;
    await user.save();

    return res.status(200).json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hubo un error al cambiar la contraseña" });
  }
};

