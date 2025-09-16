const express = require('express');
const router = express.Router();
const authMiddleware = require('../middelware/authMiddelware');
const customerValidations = require('../request/customerValidations'); 
const CustomerController = require('../controller/customer.controller');
const validate = require("../middelware/validationMiddelware.js");

router.post('/register',customerValidations.validateCustomerCreation,validate,CustomerController.register);
router.post('/login',customerValidations.validateCustomerLogin,validate,CustomerController.login);

router.use(authMiddleware);
router.post('/logout',CustomerController.logout);
router.get('/profile',CustomerController.getProfile);
router.put('/updateprofile',customerValidations.validateCustomerUpdate,validate,CustomerController.updateProfile);
router.patch('/changepassword',customerValidations.changePasswordValidation,validate,CustomerController.changePassword);

module.exports = router;