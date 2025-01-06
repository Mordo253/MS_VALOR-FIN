import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Pre-hook para hashear la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Solo si la contraseña ha cambiado
  this.password = await bcrypt.hash(this.password, 10); // Hashea la nueva contraseña
  next();
});

export default mongoose.model("User", userSchema);
