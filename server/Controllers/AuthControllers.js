const UserModel = require("../models/UserModel");
const AdminModel = require('../models/AdminModel')
const jwt = require("jsonwebtoken");
const fs = require('fs')

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "amar 843", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if(err.message ==="Incorrect email")
    errors.email ="That email is not registerd"
  

  if(err.message ==="Incorrect password")
    errors.email ="Wrong password"
  

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};



module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCrdentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err)
    res.json({errors,created:false})
  }
};



module.exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const user = await UserModel.login( email, password );
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCrdentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user:user, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err)
    res.json({errors,created:false})
  }
};



module.exports.UpdateImage = async(req,res,next)=>{
   try{
 
    const id = req.body.userId 
    const img = req.file.filename
    const update = await UserModel.findOneAndUpdate({_id:id},{$set:{image:img}},{new:true}).then((response)=>{
      res.json({updated:true,data:response})
    })   
   }catch(err){
    console.log(err)
        const errors = handleErrors(err)
        res.json({ errors, created: false })
   }
}





/////////////admin controllers////////


module.exports.adminLogin = async(req,res,next)=>{
  try{
    const {email,password} = req.body
    const admin = await AdminModel.findOne({email:email,password:password})
    if(!admin){
      res.json({message:"Incorrect email"})
    }else{
      if(admin.password === password){
        const token = createToken(admin._id)
        res.cookie("adminJWT",token,{
          withCrdentials:true,
          httpOnly:false,
          maxAge:maxAge*1000,
        })
        res.status(200).json({adminId:admin._id,token})
      }else{
        console.log("password is wrong");
        res.json({message:"Incorrect password"})
      }
    }
  }catch(error){
     console.log(error);
  }
}


module.exports.getallusers = async(req,res,next)=>{
  try{
    const allUser = await UserModel.find({})
    res.json({data:allUser})
  }catch(error){
    console.log(error);
  }
  
}


module.exports.deleteUser = async(req,res,next)=>{
  try{
    const userId = req.params.id
    await UserModel.deleteOne({_id:userId}).then(()=>{
      res.status(200).json({deleted:true})
    })
  }catch(error){
    console.log(error);
  }
}



module.exports.UserCreation = async (req, res, next) => {
  try {
    console.log("new User");
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });

    res.status(201).json({ user: user, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err)
    res.json({errors,created:false})
  }
};



module.exports.fectchuser = async (req, res, next) => {
  try {
    console.log("fech user");
    const userId = req.params.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.updatename = async(req,res,next)=>{
  try{
   const {id,email}= req.params
console.log(id,"email");
   const update = await UserModel.findOneAndUpdate({_id:id},{$set:{email:email}},{new:true}).then((response)=>{
     res.json({updated:true,data:response})
   })   
  }catch(err){
   console.log(err)
       const errors = handleErrors(err)
       res.json({ errors, created: false })
  }
}