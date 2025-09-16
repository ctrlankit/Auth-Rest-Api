const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return only the first error message
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // pick the first error
    });
  }
  next();
};

module.exports = validate;


