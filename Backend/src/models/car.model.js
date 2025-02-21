import mongoose from "mongoose";

// Cloudinary image schema
const cloudinaryImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true, unique: true, trim: true },
  secure_url: { type: String, required: true, trim: true },
  width: { type: Number, required: true, default: 1080, min: 1 },
  height: { type: Number, required: true, default: 1350, min: 1 },
  format: { type: String, required: true, default: 'jpg', trim: true },
  resource_type: { 
    type: String, 
    required: true, 
    enum: ['image', 'video', 'raw', 'auto'], 
    default: 'image'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const carSchema = new mongoose.Schema({
  title:{ type: String, required: true  },
  car:{type: String, require:true},
  price: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
  creador: { type: String, required: true, unique: true },
  propietario: { type: String, required: true, unique: true },
  kilometer: { type: Number, required: true },
  color: { type: String, required: true },
  registrationYear: { type: String, required: true },
  change: { type: String, required: true },
  tractionType: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: Number, required: true },
  place: { type: Number, required: true },
  door: { type: Number, required: true },
  fuel: { type: String, required: true },
  disponible: { type: Boolean, default: true }, // Nuevo campo para estado de disponibilidad
  description:{ type: String, required: true},
  videos: {
    type: [{
      id: String,
      url: String
    }],
    default: []
  },
  images: { type: [cloudinaryImageSchema], default: [] },
  imageLimit: { type: Number, default: 15 }
}, {
  timestamps: true, 
});
// Hook para establecer el código antes de guardar
carSchema.pre('save', async function(next) {
  if (!this.codigo) {
    this.codigo = await generateCodigo(); // Generar el nuevo código
  }
  next();
});

// Export the model
export default mongoose.model("Car", carSchema);