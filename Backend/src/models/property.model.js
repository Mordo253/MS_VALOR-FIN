import mongoose from "mongoose";

// Cloudinary image schema
const cloudinaryImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  width: { type: Number, required: true, default: 540 },  // Valor predeterminado
  height: { type: Number, required: true, default: 1170 }, // Valor predeterminado
  format: { type: String, required: true, default: 'jpg' }, // Valor predeterminado
  resource_type: { 
    type: String, 
    required: true, 
    enum: ['image', 'video', 'raw', 'auto'], 
    default: 'image'  // Valor predeterminado
  },
});

// Características internas y externas válidas
const caracteristicasInternas = [
  "Admite mascotas", "Armarios Empotrados", "Baño en habitación principal", "Citófono / Intercomunicador",
  "Depósito", "Gas domiciliario", "Suelo de cerámica / mármol", "Zona de lavandería",
  "Aire acondicionado", "Balcón", "Biblioteca/Estudio", "Clósets", "Despensa", "Hall de alcobas",
  "Trifamiliar", "Alarma", "Baño auxiliar", "Calentador", "Cocina integral", "Doble Ventana",
  "Reformado", "Unifamiliar"
];

const caracteristicasExternas = [
  "Acceso pavimentado", "Barbacoa / Parrilla / Quincho", "Cancha de futbol", "Circuito cerrado de TV",
  "Cochera / Garaje", "Gimnasio", "Oficina de negocios", "Patio", "Portería / Recepción", "Sistema de riego",
  "Trans. público cercano", "Vivienda unifamiliar", "Zona infantil", "Zonas verdes", "Árboles frutales",
  "Bosque nativos", "Centros comerciales", "Club House", "Colegios / Universidades", "Jardín",
  "Parqueadero visitantes", "Piscina", "Pozo de agua natural", "Sobre vía principal", "Urbanización Cerrada",
  "Zona campestre", "Zona residencial", "Área Social", "Cancha de baloncesto", "Cerca zona urbana",
  "Club Social", "Garaje", "Kiosko", "Parques cercanos", "Playas", "Salón Comunal", "Terraza",
  "Vigilancia", "Zona comercial", "Zonas deportivas"
];

// Esquema para las características internas y externas
const caracteristicaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['interna', 'externa'], required: true }
});

// Esquema de propiedades
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  pais: { type: String, required: true },
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  zona: { type: String, required: true },
  areaConstruida: { type: Number, required: true },
  areaTerreno: { type: Number, required: true },
  areaPrivada: { type: Number, required: true },
  alcobas: { type: Number, required: true },
  costo: { type: Number, required: true },
  banos: { type: Number, required: true },
  garaje: { type: Number, required: true },
  estrato: { type: Number, required: true },
  piso: { type: Number, required: true },
  tipoInmueble: { type: String, required: true },
  tipoNegocio: { type: String, required: true },
  estado: { type: String, required: true },
  disponible: { type: Boolean, default: true }, // Nuevo campo para estado de disponibilidad
  valorAdministracion: { type: Number, required: true },
  anioConstruccion: { type: Number, required: true },
  caracteristicas: {
    type: [caracteristicaSchema],
    validate: {
      validator: function (value) {
        return value.every(caracteristica =>
          caracteristica.type === 'interna'
            ? caracteristicasInternas.includes(caracteristica.name)
            : caracteristicasExternas.includes(caracteristica.name)
        );
      },
      message: 'Las características internas o externas no son válidas.'
    }
  },
  description: { type: String, required: true },
  images: { type: [cloudinaryImageSchema], default: [] },
  imageLimit: { type: Number, default: 15 }
}, {
  timestamps: true
});

// Generar el siguiente código
async function generateCodigo() {
  const lastProperty = await Property.findOne().sort({ createdAt: -1 }).select('codigo');
  if (!lastProperty) return 'MSV-00001'; // Si no hay propiedades, empezar en 00001

  const lastCodigo = lastProperty.codigo;
  const numericPart = parseInt(lastCodigo.split('-')[1]) + 1; // Incrementar la parte numérica
  return `MSV-${String(numericPart).padStart(5, '0')}`; // Formato MSV-0000
}

// Hook para establecer el código antes de guardar
propertySchema.pre('save', async function(next) {
  if (!this.codigo) {
    this.codigo = await generateCodigo(); // Generar el nuevo código
  }
  next();
});

// Exportar el modelo
const Property = mongoose.model("Property", propertySchema);
export default Property;
