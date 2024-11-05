import mongoose from "mongoose";

// Cloudinary image schema
const cloudinaryImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, required: true },
  resource_type: { type: String, required: true, enum: ['image', 'video', 'raw', 'auto'] },
});
 

const carSchema = new mongoose.Schema({
//   title:{ type: String, required: true  },
  car:{type: String, require:true},
  price: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
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
  description:{ type: String, required: true},
  images: { type: [cloudinaryImageSchema], default: [] },
  imageLimit: { type: Number, default: 15 }
}, {
  timestamps: true,
});
async function generateCodigo() {
  const lastCar = await Car.findOne().sort({ createdAt: -1 }).select('codigo');
  if (!lastCar) return 'MSV-001'; // Si no hay propiedades, empezar en 0001

  const lastCodigo = lastCar.codigo;
  const numericPart = parseInt(lastCodigo.split('-')[1]) + 1; // Incrementar la parte numérica
  return `MSV-${String(numericPart).padStart(3, '0')}`; // Formato MSV-0000
}

// Hook para establecer el código antes de guardar
carSchema.pre('save', async function(next) {
  if (!this.codigo) {
    this.codigo = await generateCodigo(); // Generar el nuevo código
  }
  next();
});

// Export the model
export default mongoose.model("Car", carSchema);