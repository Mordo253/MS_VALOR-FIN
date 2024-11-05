import { z } from "zod";

// Características internas y externas disponibles
const caracteristicasInternasDisponibles = [
  "Admite mascotas",
  "Armarios Empotrados",
  "Baño en habitación principal",
  "Citófono / Intercomunicador",
  "Depósito",
  "Gas domiciliario",
  "Suelo de cerámica / mármol",
  "Zona de lavandería",
  "Aire acondicionado",
  "Balcón",
  "Biblioteca/Estudio",
  "Clósets",
  "Despensa",
  "Hall de alcobas",
  "Trifamiliar",
  "Alarma",
  "Baño auxiliar",
  "Calentador",
  "Cocina integral",
  "Doble Ventana",
  "Reformado",
  "Unifamiliar",
];

const caracteristicasExternasDisponibles = [
  "Acceso pavimentado",
  "Barbacoa / Parrilla / Quincho",
  "Cancha de futbol",
  "Circuito cerrado de TV",
  "Cochera / Garaje",
  "Gimnasio",
  "Oficina de negocios",
  "Patio",
  "Portería / Recepción",
  "Sistema de riego",
  "Trans. público cercano",
  "Vivienda unifamiliar",
  "Zona infantil",
  "Zonas verdes",
  "Árboles frutales",
  "Bosque nativos",
  "Centros comerciales",
  "Club House",
  "Colegios / Universidades",
  "Jardín",
  "Parqueadero visitantes",
  "Piscina",
  "Pozo de agua natural",
  "Sobre vía principal",
  "Urbanización Cerrada",
  "Zona campestre",
  "Zona residencial",
  "Área Social",
  "Cancha de baloncesto",
  "Cerca zona urbana",
  "Club Social",
  "Garaje",
  "Kiosko",
  "Parques cercanos",
  "Playas",
  "Salón Comunal",
  "Terraza",
  "Vigilancia",
  "Zona comercial",
  "Zonas deportivas",
];

// Cloudinary image schema
const cloudinaryImageSchema = z.object({
  public_id: z.string().nonempty("El public_id es requerido"),
  secure_url: z.string().url("Debe ser una URL válida"),
  width: z.number().positive("El ancho debe ser un número positivo"),
  height: z.number().positive("La altura debe ser un número positivo"),
  format: z.string().nonempty("El formato es requerido"),
  resource_type: z.enum(["image", "video", "raw", "auto"], {
    required_error: "El tipo de recurso es requerido",
  }),
});

// Definición del esquema para las propiedades
export const createPropertySchema = z.object({
  title: z.string({
    required_error: "El título es requerido",
  }).min(3, {
    message: "El título debe tener al menos 3 caracteres",
  }),
  pais: z.string({
    required_error: "El país es requerido",
  }).min(3, {
    message: "El país debe tener al menos 3 caracteres",
  }),
  departamento: z.string({
    required_error: "El departamento es requerido",
  }),
  ciudad: z.string({
    required_error: "La ciudad es requerida",
  }),
  zona: z.string({
    required_error: "La zona es requerida",
  }),
  areaConstruida: z.number({
    required_error: "El área construida es requerida",
  }).positive({
    message: "El área construida debe ser un número positivo",
  }),
  areaTerreno: z.number({
    required_error: "El área del terreno es requerida",
  }).positive({
    message: "El área del terreno debe ser un número positivo",
  }),
  areaPrivada: z.number({
    required_error: "El área privada es requerida",
  }).positive({
    message: "El área privada debe ser un número positivo",
  }),
  alcobas: z.number({
    required_error: "El número de alcobas es requerido",
  }).int().positive({
    message: "El número de alcobas debe ser un entero positivo",
  }),
  banos: z.number({
    required_error: "El número de baños es requerido",
  }).int().positive({
    message: "El número de baños debe ser un entero positivo",
  }),
  garaje: z.number({
    required_error: "El número de garajes es requerido",
  }).int().positive({
    message: "El número de garajes debe ser un entero positivo",
  }),
  estrato: z.number({
    required_error: "El estrato es requerido",
  }).min(1).max(6, {
    message: "El estrato debe estar entre 1 y 6",
  }),
  piso: z.number({
    required_error: "El número de piso es requerido",
  }).int().positive({
    message: "El número de piso debe ser un entero positivo",
  }),
  tipoInmueble: z.enum(["Casa", "Apartamento", "Finca", "Oficina"], {
    required_error: "El tipo de inmueble es requerido",
  }),
  tipoNegocio: z.enum(["Venta", "Arriendo"], {
    required_error: "El tipo de negocio es requerido",
  }),
  estado: z.string({
    required_error: "El estado es requerido",
  }),
  valorAdministracion: z.number({
    required_error: "El valor de la administración es requerido",
  }).positive({
    message: "El valor de la administración debe ser un número positivo",
  }),
  anioConstruccion: z.number({
    required_error: "El año de construcción es requerido",
  }).int().positive({
    message: "El año de construcción debe ser un entero positivo",
  }),
  caracteristicas_internas: z.array(
    z.enum(caracteristicasInternasDisponibles, {
      invalid_type_error: "Característica interna no válida",
    })
  ),
  caracteristicas_externas: z.array(
    z.enum(caracteristicasExternasDisponibles, {
      invalid_type_error: "Característica externa no válida",
    })
  ),
  description: z.string({
    required_error: "La descripción es requerida",
  }).min(15, {
    message: "La descripción debe tener al menos 15 caracteres",
  }),
  images: z.array(cloudinaryImageSchema).max(15, {
    message: "Solo puedes subir un máximo de 15 imágenes",
  }),
});