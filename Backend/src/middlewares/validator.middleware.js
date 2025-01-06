export const validateSchema = (schema) => (req, res, next) => {
  console.log("Request body:", req.body);

  const validationResult = schema.safeParse(req.body);
  // console.log("Validation result:", validationResult);

  if (!validationResult.success) {
    console.error("Validation error:", validationResult.error);
    return res.status(400).json({
      errors: validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  next();
};
