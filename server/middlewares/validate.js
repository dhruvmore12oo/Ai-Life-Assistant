const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.isJoi = true; // Flags error for the centralized errorHandler
      return next(error);
    }
    next();
  };
};

module.exports = validate;
