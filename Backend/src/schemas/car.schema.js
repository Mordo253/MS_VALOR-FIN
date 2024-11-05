import { z } from 'zod';

// Esquema de imágenes de Cloudinary
const cloudinaryImageSchema = z.object({
  public_id: z.string().nonempty("El ID de la imagen es obligatorio."),
  secure_url: z.string().url("Debe ser una URL válida."),
  width: z.number().positive("El ancho debe ser un número positivo."),
  height: z.number().positive("La altura debe ser un número positivo."),
  format: z.string().nonempty("El formato es obligatorio."),
  resource_type: z.enum(['image', 'video', 'raw', 'auto'], {
    errorMap: () => ({ message: "Tipo de recurso no válido." })
  })
});

// Esquema de vehículos
const carSchema = z.object({
  car: z.string().nonempty("El nombre del vehículo es obligatorio."),
  price: z.number().positive("El precio debe ser un número positivo."),
  kilometer: z.number().positive("El kilometraje debe ser un número positivo."),
  color: z.string().nonempty("El color del vehículo es obligatorio."),
  registrationYear: z.string().nonempty("El año de registro es obligatorio."),
  change: z.string().nonempty("El cambio debe es obligatorio."),
  tractionType: z.number().nonempty("El tipo de tracción es obligatorio."),
  brand: z.string().nonempty("La marca debe ser un número positivo."),
  model: z.number().positive("El modelo debe ser un número positivo."),
  place: z.number().positive("El número de plazas debe ser un número positivo."),
  door: z.number().positive("El número de puertas debe ser un número positivo."),
  fuel: z.string().nonempty("El tipo de combustible es obligatorio."),
  description: z.string().nonempty("La descripción es obligatoria."),
  images: z.array(cloudinaryImageSchema).max(15, "No se pueden agregar más de 15 imágenes."),
  imageLimit: z.number().default(15)
});

// Exporta el esquema para usar en validaciones
export { carSchema };
