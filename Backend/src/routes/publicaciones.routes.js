import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPublicacionSchema, updatePublicacionSchema } from "../schemas/publicacion.schema.js";
import {
    getPublicaciones,
    getPublicacion,
    createPublicacion,
    updatePublicacion,
    deletePublicacion,
    getPublicacionesByUser
} from "../controllers/publicaciones.controller.js";

const router = Router();

// Rutas públicas
router.get("/publicaciones", getPublicaciones);
router.get("/publicaciones/:id", getPublicacion);

// Rutas protegidas
router.get("/user/publicaciones", auth, getPublicacionesByUser);
router.post("/publicaciones", auth, validateSchema(createPublicacionSchema), createPublicacion);
router.put("/publicaciones/:id", auth, validateSchema(updatePublicacionSchema), updatePublicacion);
router.delete("/publicaciones/:id", auth, deletePublicacion);

export default router;