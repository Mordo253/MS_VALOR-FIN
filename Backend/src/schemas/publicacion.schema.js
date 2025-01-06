import { z } from "zod";

export const createPublicacionSchema = z.object({
    titulo: z.string({
        required_error: "El título es requerido",
    }),
    descripcion: z.string({
        required_error: "La descripción es requerida",
    }),
    imagen: z.object({
        url: z.string().optional(),
        public_id: z.string().optional()
    }).optional(),
    status: z.enum(['pendiente', 'publicado', 'rechazado']).default('pendiente'),
});

export const updatePublicacionSchema = z.object({
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    imagen: z.object({
        url: z.string(),
        public_id: z.string()
    }).optional(),
    status: z.enum(['pendiente', 'publicado', 'rechazado']).optional(),
});