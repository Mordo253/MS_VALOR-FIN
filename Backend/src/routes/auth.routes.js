// routes/auth.routes.js
import { Router } from "express";
import {
  login,
  logout,
  verifyToken,
  changePassword,
  register,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, changePasswordSchema, registerSchema } from "../schemas/auth.schema.js";
import { auth } from "../middlewares/auth.middleware.js";  // Middleware de autenticación

const router = Router();

// Ruta de login
router.post("/login", validateSchema(loginSchema), login);
router.post("/register", validateSchema(registerSchema), register);

// Ruta para verificar el token
router.get("/verify", verifyToken);

// Ruta para logout
router.post("/logout", verifyToken, logout);

// Ruta para cambiar la contraseña
router.put("/change-password", auth, validateSchema(changePasswordSchema), changePassword);

export default router;
