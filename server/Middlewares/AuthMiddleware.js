const UserModel = require("../models/UserModel")
const User = require("../models/UserModel") 
const Admin = require('../models/AdminModel')
const jwt = require('jsonwebtoken')


module.exports.checkUser = (req,res,next)=>{
    const token = req.cookies.jwt
    console.log('on check user');
    if(token){
        jwt.verify(token,'amar 843',async (err,decodedToken)=>{
            if(err){
                res.json({status : false})
                next()
            }else{
                console.log('on else',decodedToken.id);
                const user = await User.findById(decodedToken.id)
                if(user){
                    console.log('user is there',user);
                    if(user){
                        console.log(user,878);
                        res.json({status:true,user:user})
                    }else{
                        const data = await UserModel.find({})
                        res.status(200).json({ status: true, data: data });
                    }
                }else{
                    res.json({ status: false })
                    next() 
                }
            }
        })
    }else{
        res.json({ status: false })
        next()
    }
}



module.exports.checkAdmin =(req,res,next)=>{
    const token = req.cookies.adminjwt
    if(token){
        jwt.verify(token,'amar 843',async(err,decodedToken)=>{
            if(err){
                res.json({status:false})
                next()
            }else{
                const admin = await Admin.findById(decodedToken.id)
                    if(admin) res.json({status:true,admin:admin._id})
                    else res.json({status:false})
                    next()
            }
        })
    }
}