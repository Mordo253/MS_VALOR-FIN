import { Router } from "express";
import {
    createCar,
    deleteCar,
    getAllCars,
    getCarById,
    updateAvailability,
    updateCar,
} from "../controllers/car.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import fileUpload from "express-fileupload";
// import { validateSchema } from "../middlewares/validator.middleware.js";
// import { createPropertySchema } from "../schemas/property.schema.js";

const router = Router();
 
router.get("/all-cars", getAllCars);
router.get("/cars/:id", getCarById);
router.post("/cars", auth,fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }), createCar);
router.put("/cars/:id", auth, fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }), updateCar);
router.patch('/cars/:id/availability', auth, updateAvailability);
router.delete("/cars/:id", auth, deleteCar);

export default router;
