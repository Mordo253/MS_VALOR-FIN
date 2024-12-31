export const validateSchema = (schema) => (req, res, next) => {
  // Verificamos los datos que llegan en la solicitud
  console.log(req.body);  // Verifica los datos que están llegando

  try {
    schema.parse(req.body);  // Valida el cuerpo de la solicitud usando el esquema Zod
    next();  // Si pasa la validación, continúa con la siguiente función middleware
  } catch (error) {
    // Comprobamos si error.errors es un array
    if (!Array.isArray(error.errors)) {
      return res.status(400).json({
        message: "Error inesperado en la validación",  // Mensaje de error genérico
        error: error.message,  // El error que se produjo
      });
    }

    // Manejo de errores de validación si error.errors es un array
    return res.status(400).json({
      message: "Error en la validación de los datos",  // Mensaje general
      errors: error.errors.map((err) => ({
        path: err.path,  // El campo que falló la validación
        message: err.message,  // El mensaje de error específico
      })),
    });
  }
};
