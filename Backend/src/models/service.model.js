// models/servicio.model.js
import mongoose from "mongoose";

// Cloudinary image schema (reutilizando el mismo esquema)
const cloudinaryImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  width: { type: Number, required: true, default: 540 },
  height: { type: Number, required: true, default: 1170 },
  format: { type: String, required: true, default: 'jpg' },
  resource_type: { 
    type: String, 
    required: true, 
    enum: ['image', 'video', 'raw', 'auto'], 
    default: 'image'
  },
});

const ServicioSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Por favor ingrese un título del servicio'],
      trim: true,
      maxLength: [1000, 'El título no puede tener más de 1000 caracteres'],
      set: (value) => {
        // Sanitizar HTML si es necesario
        return value;
      }
    },
    codigo: { type: String, required: true, unique: true },
    content: {
      type: String,
      required: [true, 'Por favor ingrese la descripción del servicio'],
      trim: true,
      set: (value) => {
        // Sanitizar HTML si es necesario
        return value;
      }
    },
    categoria: {
      type: String,
      required: [true, 'Por favor seleccione una categoría'],
      enum: ['Avalúos', 'Desenglobes', 'Estudios de Títulos', 
             'Trámites notariales y registro de Instrumentos públicos', 
             'Derecho urbano e inmobiliario', 'Sucesiones']
    },
    images: {
      type: [cloudinaryImageSchema],
      default: []
    },
    disponible: {
      type: Boolean,
      default: true
    },
    slug: {
      type: String,
      unique: true
    }
  }, {
    timestamps: true
  });
  
  // Modificar el middleware para generar slug sin HTML
  ServicioSchema.pre('save', function(next) {
    // Eliminar etiquetas HTML para el slug
    const plainTitle = this.title.replace(/<[^>]*>/g, '');
    this.slug = plainTitle
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
    next();
  });
 
  export default mongoose.model('Servicio', ServicioSchema);