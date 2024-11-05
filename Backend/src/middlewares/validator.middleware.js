export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);  // Valida el cuerpo de la solicitud usando el esquema Zod
    next();  // Si pasa la validación, continúa con la siguiente función middleware
  } catch (error) {
    // Manejo de errores de validación
    return res.status(400).json({
      message: "Error en la validación de los datos",  // Mensaje general
      errors: error.errors.map((err) => ({
        path: err.path,  // El campo que falló la validación
        message: err.message,  // El mensaje de error específico
      })),
    });
  }
};