const authToken = require("../models/authToken.model");
const jwt = require("jsonwebtoken");
const customer = require("../models/customer.model");

const authMiddelware = async (req,res,next) => 
{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try 
        {
            token = req.headers.authorization.split(" ")[1];
            checkToken = await authToken.where('token').equals(token).where('revoked').equals(false).findOne();
            if(!checkToken)
            {
                return res.status(401).json({success: false, message: "Not authorized"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.customer = await customer.findById(decoded.id).select("-password");
            next();
        } catch (error) 
        {
            return res.status(401).json({success: false, message: "Not authorized"});
           
        }
    }
    if(!token)
    {
        return res.status(401).json({success: false, message: "auth token required"});
    }
};

module.exports = authMiddelware;
