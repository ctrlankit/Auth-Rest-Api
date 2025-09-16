const mongoose = require("mongoose");

exports.successResponse = (res, data) => {
    res.status(200).json({
        success: true,
        message: "Success",
        data: data,
    });
};

exports.successFullyCreatedResponse = (res,message) => {
    res.status(201).json({
        success: true,
        message: message ?? "Succesfully created",
    });
};


exports.errorResponse = (res, message) => {
    res.status(500).json({
        success: false,
        message: message || "oops something went wrong",
    });
};


exports.notFoundResponse = (res, message) => {
    res.status(404).json({
        success: false,
        message: message || "Not found",
    });
};

