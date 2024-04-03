const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { APIError } = require("./errorApi");

exports.userRequired = (req,res,next)=>{
    try {
        let token = req.cookie?.bflux;//getting from cookies
        if(!token) token = req.headers?.authorization?.split(" ")[1];
        if(!token) token = req.headers?.cookie?.split("=")[1];
        if(!token) token = req.body?.token;
        if(!token) return next(APIError.unauthenticated());
        const payload = jwt.verify(token, config.ACCESS_TOKEN_SECRET)
        //verifying token
        req.userId = payload.id;
        req.userEmail = payload.email;
        req.userRole = payload.role;

        next();
        console.log(payload);

    } catch (error) {
        if(error.message === "jwt expired")return next(APIError.unauthenticated("Access Token Expired"));
        next(error)
    }
    
}
exports.adminRequired = (req,res,next)=>{
    try {
        let token = req.cookie?.bflux;//getting from cookies
        if(!token) token = req.header?.authorization?.split(" ")[1];
        if(!token) token = req.header?.cookie?.split("=")[1];
        if(!token) token = req.body?.token;
        if(!token) return next(APIError.unauthenticated);
        const payload = jwt.verify(token, config.ACCESS_TOKEN_SECRET)
        if(payload.role !== "admin") return next (APIError.unauthorized);
        //verifying token
        req.userId = payload.id;
        req.userEmail = payload.email;
        req.userrole = payload.role;
        next();
        console.log(payload);

    } catch (error) {
        if(error.message === "jwt expired") next(APIError.unauthorized("Access Token Expired"));
        else next(error)
        // next(error)
    }
    
}
