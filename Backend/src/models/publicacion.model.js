import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true
        },
        imagen: {
            url: String,
            public_id: String
        },
        status: {
            type: String,
            enum: ['pendiente', 'publicado', 'rechazado'],
            default: 'pendiente'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Middleware para sincronizar con Google Sheets después de guardar
publicacionSchema.post('save', async function(doc) {
    try {
        // La sincronización se maneja automáticamente a través del change stream
        console.log('✅ Publicación guardada:', doc._id);
    } catch (error) {
        console.error('❌ Error post-save:', error);
    }
});

export default mongoose.model("Publicacion", publicacionSchema);