const { Schema, model } = require("mongoose");


const AccountSchema = new Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        indexed:true,
    },
    dateofbirth:{
        type: Date,
        required: true,
    },
    stateoforigin:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    number:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type:[]
    },
    type:{
        type:String,
        required: true,
        enum: ["admin","user"],
        indexed: true,
    },
    state:{
        type: String,
        required:true,
        enum:[
            "active", "suspended", "deactivated"
        ],
        default:"active"
    }
},
    {timestamps:true}
)
const AccountModel = model("Account", AccountSchema)
module.exports = AccountModel;