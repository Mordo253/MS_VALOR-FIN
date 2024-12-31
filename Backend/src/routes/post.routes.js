import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    updateAvailability,
    updatePost,
} from "../controllers/post.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import fileUpload from "express-fileupload";

const router = Router();
// rutas publicas
router.get("/all-posts", getAllPosts);
router.get("/posts/:slug", getPostBySlug);

// rutas privadas
router.post("/posts", auth, fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }), createPost);
router.put("/posts/:slug", auth, fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }), updatePost);
router.patch('/posts/:slug/availability', auth, updateAvailability);
router.delete("/posts/:slug", auth, deletePost);

export default router;