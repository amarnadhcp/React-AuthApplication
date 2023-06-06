const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema= new mongoose.Schema({

    email:{
        type:"string",
        required:[true,"Email is required"],
        unique : true
    },

    password:{
        type:"string",
        required:[true,"Password is required"]
    },

    image:{
        type:"string",
        default:''
    }
})

UserSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

UserSchema.statics.login = async function(email,password){
    const user= await this.findOne({email})
    if(user){
        const auth = bcrypt.compare(password,user.password)
        if(auth){
            return user;
        }
        throw Error("Incorrect password")
    }
    throw Error("Incorrect email")
}

module.exports = mongoose.model("Users",UserSchema);