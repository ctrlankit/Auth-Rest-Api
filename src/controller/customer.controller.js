const customer = require("../models/customer.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authToken = require("../models/authToken.model");
const controller = require("./controller");
const generateToken = require("../utlis/generateToken");

class CustomerController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if the user already exists
      const existingCustomer = await customer.findOne({ email });
      if (existingCustomer) {
        return controller.errorResponse(res, "User already exists");
      }

      //create a new customer
      const newCustomer = new customer(req.body);
      await newCustomer.save();
      if (!newCustomer) {
        return controller.errorResponse(res, "Failed to create user");
      }
      return controller.successFullyCreatedResponse(
        res,
        "User registered successfully"
      );
    } catch (error) {
      console.error("Error in register:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }

  static async login(req, res) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      const existingCustomer = await customer.findOne({ email });

      if (!existingCustomer) {
        return controller.errorResponse(res, "Invalid email or password");
      }
      const isMatch = await existingCustomer.matchPassword(password);

      if (!isMatch) {
        return controller.errorResponse(res, "Invalid email or password");
      }

      // Generate JWT token
      const token = generateToken(existingCustomer._id);

      //save token
      const accessToken = await authToken.create({
        token: token,
        clientId: existingCustomer._id,
        revoked: false,
        createdAt: new Date(),
      });

      // Add token to the response
      existingCustomer._doc.token = token;

      return controller.successResponse(res, {
        message: "Login successful",
        data: existingCustomer,
      });
    } catch (error) {
      console.error("Error in login:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }

  static async logout(req, res) {
    try {
      const authCustomer = await customer.findById(req.customer._id);
      if (!authCustomer) {
        return controller.errorResponse(res, "User not found");
      }
      const token = await authToken.updateMany(
        { clientId: authCustomer._id, revoked: false },
        { $set: { revoked: true } }
      );
      return controller.successFullyCreatedResponse(res, "Logout successful");
    } catch (error) {
      console.error("Error in logout:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }

  static async getProfile(req, res) {
    try {
      const authCustomer = await customer
        .findById(req.customer._id)
        .select("-password");
      return controller.successResponse(res, {
        message: "Profile fetched successfully",
        data: authCustomer,
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (phone) data.phone = phone;

      const authCustomer = await customer
        .findByIdAndUpdate(req.customer._id, data, { new: true })
        .select("-password");
      return controller.successResponse(res, {
        message: "Profile updated successfully",
        data: authCustomer,
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }

  static async changePassword(req, res) {
    try {
      const {oldPassword, newPassword, confirmPassword } = req.body;

      const authCustomer = await customer.findOne(req.customer._id);
      if (!authCustomer) {
        return controller.errorResponse(res, "User not found");
      }
      const isMatch = await authCustomer.matchPassword(oldPassword);

      if (!isMatch) {
        return controller.errorResponse(res, "Old password is incorrect");
      }
      authCustomer.password = req.body.newPassword;
      await authCustomer.save();
      return controller.successFullyCreatedResponse(res,"Password changed successfully");
    } catch (error) {
      console.error("Error in changePassword:", error);
      return controller.errorResponse(res, "Internal server error");
    }
  }
}
module.exports = CustomerController;
