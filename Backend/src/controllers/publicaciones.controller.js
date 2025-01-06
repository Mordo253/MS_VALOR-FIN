import Publicacion from "../models/publicacion.model.js";

export const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find()
            .populate('user', ['username', 'email'])
            .sort({ createdAt: -1 });
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicacion = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id)
            .populate('user', ['username', 'email']);
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPublicacion = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, status } = req.body;
        const newPublicacion = new Publicacion({
            titulo,
            descripcion,
            imagen,
            status,
            user: req.user.id
        });
        const savedPublicacion = await newPublicacion.save();
        res.json(savedPublicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePublicacion = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        
        // Verificar que el usuario sea el dueño de la publicación
        if (!req.user.isAdmin && publicacion.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para actualizar esta publicación" });
        }

        const updatedPublicacion = await Publicacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPublicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePublicacion = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
        
        // Verificar que el usuario sea el dueño de la publicación o admin
        if (!req.user.isAdmin && publicacion.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación" });
        }

        await publicacion.deleteOne();
        res.json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicacionesByUser = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};