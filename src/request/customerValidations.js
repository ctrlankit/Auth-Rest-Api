const { body } = require("express-validator");

exports.validateCustomerCreation = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("name").notEmpty().withMessage("Name is required"),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
];

exports.validateCustomerLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateCustomerUpdate = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
];

exports.changePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];
