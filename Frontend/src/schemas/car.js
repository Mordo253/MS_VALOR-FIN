import { z } from "zod";

const cloudinaryImageSchema = z.object({
  public_id: z.string(),
  secure_url: z.string().url("Debe ser una URL válida."),
  width: z.number().positive("El ancho debe ser un número positivo."),
  height: z.number().positive("La altura debe ser un número positivo."),
  format: z.string(),
  resource_type: z.enum(['image', 'video', 'raw', 'auto']),
});

// Esquema de vehículos
export const carSchema = z.object({
  car: z.string({
    required_error: "El nombre del vehículo es obligatorio.",
  }),
  price: z.number().positive("El precio debe ser un número positivo."),
  kilometer: z.number().positive("El kilometraje debe ser un número positivo."),
  color: z.string({
    required_error: "El color del vehículo es obligatorio.",
  }),
  registrationYear: z.number().min(1900, {
    message: "El año de registro debe ser válido (mayor o igual a 1900).",
  }),
  change: z.string({
    required_error: "El cambio es obligatorio.",
  }),
  tractionType: z.string({
    required_error: "El tipo de tracción es obligatorio.",
  }),
  brand: z.string({
    required_error: "La marca del vehículo es obligatoria.",
  }),
  model: z.string({
    required_error: "El modelo del vehículo es obligatorio.",
  }),
  place: z.number().min(1, "Debe tener al menos una plaza."),
  door: z.number().min(1, "Debe tener al menos una puerta."),
  fuel: z.string({
    required_error: "El tipo de combustible es obligatorio.",
  }),
  description: z.string({
    required_error: "La descripción es obligatoria.",
  }),
  images: z.array(cloudinaryImageSchema).max(15, {
    message: "Puedes subir un máximo de 15 imágenes.",
  }),
});
