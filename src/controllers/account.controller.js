const { hashSync, compareSync } = require("bcryptjs");
const AccountModel = require("../models/account");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { reset } = require("nodemon");
const { isEmailvalid, isPhoneNumberValid } = require("../utils/validate");
const { cloudinary } = require("../utils/cloudinary");
const ProfileModel = require("../models/profile");
const { APIError } = require("../middlewares/errorApi");

exports.register = async(req, res, next) =>{
    try {
        
    const {firstname, lastname, username, dateofbirth, stateoforigin, address, email, number, password,} = req.body;
    if(!firstname)return next(APIError.badRequest("First name is required")) //return res.status(400).json({error: "first name is required"})
    if(!lastname)return next(APIError.badRequest("Last name is required")) //return res.status(400).json({error: "last name is required"})
    if(!username)return next(APIError.badRequest("User name is required")) //return res.status(400).json({error: "user name is required"})
    if(!dateofbirth)return next(APIError.badRequest("date of birth is required is required")) //return res.status(400).json({error: "date of birth is required"})
    if(!stateoforigin)return next(APIError.badRequest("state of origin is required")) //return res.status(400).json({error: "state of origin is required"})
    if(!address)return next(APIError.badRequest("address is required"))//return res.status(400).json({error: "address is required"})
    if(!email)return next(APIError.badRequest("email is required")) //return res.status(400).json({error: "email is required"})
    if(!number)return next(APIError.badRequest("number is required")) //return res.status(400).json({error: "number is required"})
    if(!password)return next(APIError.badRequest("password is required")) //return res.status(400).json({error: "password is required"})
    
    if(!isEmailvalid(email)) return res.status(400).json({error: "Invalid email"})
    const emailExist = await AccountModel.findOne({
        email
    }).exec();
    if(emailExist)res.status(400).json({error: "email already exist"})
    
    if(!isPhoneNumberValid(number)) return next(APIError.badRequest("Invalid Number"))

    const usernameExist = await AccountModel.findOne({
        username
    }).exec();

    if(usernameExist) return res.status(400).json({error: "username already exist"})
    

    const hashedpassword = hashSync(password,10)
    
    const user ={
        firstname,
        lastname,
        username,
        dateofbirth,
        stateoforigin,
        address,
        email,
        number,
        password:hashedpassword,
        type:"user"
    }
    console.log(req.body);
    const newUser = await AccountModel.create({...user})
    
    if(!newUser) return res.status(400).json({error: "Account failed to create"})
    res.status(201).json({
        success:true,
        msg:"Account created successfully"
    })

}
    catch (error) {
        next(error)
    }
}
exports.registerAd = async(req, res, next) =>{
    try {
        
    const {firstname, lastname, username, dateofbirth, stateoforigin, address, email, number, password,} = req.body;
    if(!firstname)return next(APIError.badRequest("First name is required")) //return res.status(400).json({error: "first name is required"})
    if(!lastname)return next(APIError.badRequest("Last name is required")) //return res.status(400).json({error: "last name is required"})
    if(!username)return next(APIError.badRequest("User name is required")) //return res.status(400).json({error: "user name is required"})
    if(!dateofbirth)return next(APIError.badRequest("date of birth is required is required")) //return res.status(400).json({error: "date of birth is required"})
    if(!stateoforigin)return next(APIError.badRequest("state of origin is required")) //return res.status(400).json({error: "state of origin is required"})
    if(!address)return next(APIError.badRequest("address is required"))//return res.status(400).json({error: "address is required"})
    if(!email)return next(APIError.badRequest("email is required")) //return res.status(400).json({error: "email is required"})
    if(!number)return next(APIError.badRequest("number is required")) //return res.status(400).json({error: "number is required"})
    if(!password)return next(APIError.badRequest("password is required")) //return res.status(400).json({error: "password is required"})
    
    if(!isEmailvalid(email)) return res.status(400).json({error: "Invalid email"})
    const emailExist = await AccountModel.findOne({
        email
    }).exec();
    if(emailExist)res.status(400).json({error: "email already exist"})
    
    if(!isPhoneNumberValid(number)) return next(APIError.badRequest("Invalid Number"))

    const usernameExist = await AccountModel.findOne({
        username
    }).exec();

    if(usernameExist) return res.status(400).json({error: "username already exist"})
    

    const hashedpassword = hashSync(password,10)
    
    const user ={
        firstname,
        lastname,
        username,
        dateofbirth,
        stateoforigin,
        address,
        email,
        number,
        password:hashedpassword,
        type:"admin"
    }
    console.log(req.body);
    const newUser = await AccountModel.create({...user})
    
    if(!newUser) return res.status(400).json({error: "Account failed to create"})
    res.status(201).json({
        success:true,
        msg:"Account created successfully"
    })

}
    catch (error) {
        next(error)
    }
}

exports.login = async(req,res,next) =>{
    try {
        
        // const token = req.cookie.bflux;
        // const token = req.body;
        // console.log(req.headers.cookie);
        let token = req.headers?.unauthorization?.split(" ")[1];
        if(!token) token = req.headers?.cookie?.split("=")[1]
        const{username, password} = req.body
        if(!username) return res.status(400).json({error: "username is required"})
        if(!password) return res.status(400).json({error: "password is required"})
        const userExist = await AccountModel.findOne({username})
        if(!userExist)res.status(404).json({error:"user not found"})
        // console.log(findUser);
    const checkUser = compareSync(password,userExist.password)
    if(!checkUser) return next(APIError.notFound("User not found"))//return res.status(400).json({error:"incorrect password"})
    if(userExist.state === "deactivated") return next(APIError.unauthorized("Account has been deactivated"))
    if(userExist.refreshToken.length > 0)return res.status(403).json({error:"You're already logged in"})
    //authentication
const payload = {
    id: userExist._id.toString(userExist),
        email:userExist.email,
        role: userExist.type,
    };
    const accessToken = jwt.sign(payload,config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    // console.log(accessToken);
    const refreshToken = jwt.sign(payload,config.REFRESH_TOKEN_SECRET,{expiresIn:"30m"});
    userExist.refreshToken = [...userExist.refreshToken, refreshToken]
    userExist.save();
    res.cookie(
        "bflux", accessToken,{
            httpOnly:false,
            secure:true,
            sameSite: "none",
            maxAge: 60*60 * 1000

        }
    )
    return res.status(200).json({
        success:true,
        msg:"login successfully",
        user:{
            username:userExist.username,
            email:userExist.email,
            firstname:userExist.firstname,
            lastname:userExist.lastname,
            dateofbirth:userExist.dateofbirth,
            stateoforigin:userExist.stateoforigin,
            address:userExist.address,
        },
        accessToken,
        refreshToken
    })
    
    } catch (error) {
        next(error)
    }
    }
    
    //updating new picture for the user
    exports.updateProfile = async(req,res)=>{
        try {
            //fileData
            const {fileData} = req.body;
            //firsst image upload
            if(fileData){
                cloudinary.uploader.upload(fileData, (error,result)=>{
                    if (error) return res.status(400).json({error});
                    profile.imageId = result.public_id;
                    profile.imageUrl = result.secure_url;
                })
            }
            const saveImage = ProfileModel.create({...profile});
            if(profile.error) return res.status(400).json({error});
            res.status(200).json({success:true, msg: "profile picture updated successfully"});

        } catch (error) {
            next(error)
        }
    }
    
    exports.updateAccountState = async(err, req, res, next) => {
        try {
            const {id, state} = req.body;
            if(!id) return next (APIError.badRequest("Account id is required"));
            if(!state) return next(APIError.badRequest("Account state is requirerd"));
            const userExist = await AccountModel.findOne({_id:id.toString()});
            if(!userExist) return next(APIError.notFound());
            if(userExist.err) return next(APIError.badRequest(userExist.err));
            // update status
            userExist.state = state;
            userExist.save();
            res.status(200).json({success:true, msg:"Account state updated"})
        } catch (error) {
            next(error)
        }
    }

    exports.userAccounts = async(_req, res, next) => {
        try {
            const users = await AccountModel.find({}).exec();
            if(users.length === 0) return next(APIError.notFound());
            res.status(200).json({success:true,msg: "Found",users
            })
        } catch (error) {
            next(error)
        }
    }

    exports.logout = async (req, res, next) => {
        try{
          let token = req.headers?.authorization?.split(" ")[1];
          if(!token) token = req.cookie?.bflux;
          if(!token) token = req.headers?.cookie?.split("=")[1]; 
          const {refreshToken} = req.body; 
          if(!refreshToken) return res.status(400).json({error: "RefreshToken is required"})
          if(!token) return res.status(400).json({error: "AccessToken is required"});
          const checkToken = jwt.decode(token)
          if(!checkToken || checkToken.error) return next(APIError.unauthenticated());
      
          const foundUser = await AccountModel.findOne({refreshToken}).exec();
        // Detected refresh toke reuse
        if (!foundUser) {
          jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET , async (err, decoded) => {
            if (err) return next(APIError.unauthorized("Invalid Refresh Token"));
            const usedToken = await AccountModel.findOne({_id:decoded.id}).exec();
            usedToken.refreshToken = [];
            usedToken.save();
          }); 
          return next(APIError.unauthorized("Invalid Refresh Token"));
        }
      
        const newRefreshTokenArr = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        //evaluate jwt
        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async (err, decoded) => {
          if (err) {
            foundUser.refreshToken = [...newRefreshTokenArr];
            foundUser.save();
          }
          if (err || foundUser._id.toString() !== decoded.id) return next(APIError.unauthenticated("Token expired"));
        });
    
         foundUser.refreshToken = [...newRefreshTokenArr];
            foundUser.save();
        res.clearCookie("bflux");
        res
          .status(200)
          .json({ success: true, msg: "You have successfully logged out" });
        }catch(error){
        next(error);
        }
    }

    exports.handleRefreshToken = async(req, res, next) => {
        try {
            let token = req.headers?.unauthorization?.split(" ")[1];
            if(!token) token = req.headers?.cookie.split("=")[1];
            const {refreshToken} = req.body;
            if(!refreshToken) return res.status(400).json({error: "RefreshToken is required"});
            if(!token) return res.status(400).json({error: "AccessToken is required"});
            const checkToken = jwt.decode(token, config.ACCESS_TOKEN_SECRET);
            if(!checkToken || checkToken.error) return next(APIError.unauthenticated());

            const foundUser = await AccountModel.findOne({refreshToken}).exec();
            console.log(foundUser);
            // Detected refreshToken reuse
            if(!foundUser){
                jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async(err, decoded)=>{
                    if (err) return next(APIError.unauthorized("Invalid Refresh token"));
                    const usedToken = await AccountModel.findOne({_id:decoded.id}).exec();
                    usedToken.refreshToken = [];
                    usedToken.save();
                });
                return next(APIError.unauthorized("Invalid Refresh Token"));
            }
            const newRefreshTokenArr = foundUser.refreshToken.filter(rt => rt !== refreshToken);
            // evaluate jwt
            jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, async(err, decoded)=>{
                if(err){
                    foundUser.refreshToken = [...newRefreshTokenArr];
                    foundUser.save();
                }
                if(err || foundUser._id.toString() !== decoded.id) return next(APIError.unauthenticated("Token expired"));
            })
            // RefreshToken still valid
            const payload = {
                    id: foundUser._id.toString(),
                    email:foundUser.email,
                    role: foundUser.type,
                };
                const accessToken = jwt.sign(payload,config.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
                // console.log(accessToken);
                const newRefreshToken = jwt.sign(payload,config.REFRESH_TOKEN_SECRET,{expiresIn:"30m"});
                foundUser.refreshToken = [...foundUser.refreshToken, newRefreshToken]
                foundUser.save();
                res.clearCookie("bflux");
                res.cookie(
                    "bflux", accessToken,{
                        httpOnly:false,
                        secure:true,
                        sameSite: "none",
                        maxAge: 60*60 * 1000
                    }
                )
                return res.status(200).json({
                    success:true,
                    msg:"RefreshToken renewed",

                    accessToken,
                    newRefreshToken
                })
        } catch (error) {
            next(error)
        }
    }

    exports.checkUserToken = async(req,res,next)=>{
        try {
            res.status(200).json({success: true, msg: "token is valid"})
        } catch (error) {
            next(error)
        }
    }