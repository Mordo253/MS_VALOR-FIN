import { z } from "zod";

// Define the internal features enum
const caracteristicasInternas = [
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

// Define the external features enum
const caracteristicasExternas = [
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

// Property schema
export const propertySchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  pais: z.string({
    required_error: "Country is required",
  }),
  departamento: z.string({
    required_error: "Department is required",
  }),
  ciudad: z.string({
    required_error: "City is required",
  }),
  zona: z.string({
    required_error: "Zone is required",
  }),
  areaConstruida: z.number().min(0, {
    message: "Area construida must be a positive number",
  }),
  areaTerreno: z.number().min(0, {
    message: "Area terreno must be a positive number",
  }),
  areaPrivada: z.number().min(0, {
    message: "Area privada must be a positive number",
  }),
  alcobas: z.number().min(0, {
    message: "Number of alcobas must be a positive number",
  }),
  banos: z.number().min(0, {
    message: "Number of banos must be a positive number",
  }),
  garaje: z.number().min(0, {
    message: "Number of garaje must be a positive number",
  }),
  estrato: z.number().min(0, {
    message: "Estrato must be a positive number",
  }),
  piso: z.number().min(0, {
    message: "Piso must be a positive number",
  }),
  tipoInmueble: z.string({
    required_error: "Tipo Inmueble is required",
  }),
  tipoNegocio: z.string({
    required_error: "Tipo Negocio is required",
  }),
  estado: z.string({
    required_error: "Estado is required",
  }),
  valorAdministracion: z.number().min(0, {
    message: "Valor Administracion must be a positive number",
  }),
  anioConstruccion: z.number().min(1900, {
    message: "Anio Construccion must be a valid year",
  }),
  caracteristicas_internas: z.array(z.enum(caracteristicasInternas)).optional(),
  caracteristicas_externas: z.array(z.enum(caracteristicasExternas)).optional(),
  description: z.string({
    required_error: "Description is required",
  }),
  images: z.array(z.object({
    public_id: z.string(),
    secure_url: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    resource_type: z.enum(['image', 'video', 'raw', 'auto']),
  })).max(10, {
    message: "You can upload a maximum of 10 images.",
  }),
});
