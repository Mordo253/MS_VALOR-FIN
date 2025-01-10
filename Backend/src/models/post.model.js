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

const PostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Por favor ingrese un título'],
      trim: true,
      maxLength: [1000, 'El título no puede tener más de 1000 caracteres'], // Aumentado para HTML
      set: (value) => {
        // Sanitizar HTML aquí si es necesario
        return value;
      }
    },
    codigo: { type: String, required: true, unique: true },
    content: {
      type: String,
      required: [true, 'Por favor ingrese el contenido'],
      trim: true,
      set: (value) => {
        // Sanitizar HTML aquí si es necesario
        return value;
      }
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
  PostSchema.pre('save', function(next) {
    // Eliminar etiquetas HTML para el slug
    const plainTitle = this.title.replace(/<[^>]*>/g, '');
    this.slug = plainTitle
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
    next();
  });
 
  export default mongoose.model('Post', PostSchema);