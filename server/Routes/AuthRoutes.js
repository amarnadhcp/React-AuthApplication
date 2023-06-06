// const { Router } = require('express');
const { register, login,adminLogin,getallusers,deleteUser,UpdateImage,UserCreation ,fectchuser,updatename } = require('../Controllers/AuthControllers');
const { checkUser,checkAdmin } = require('../Middlewares/AuthMiddleware');
const { uploadOptions } = require('../Middlewares/multer');


const router = require('express').Router()

router.post("/",checkUser)
router.post("/register",register);
router.post("/login",login);
router.post('/imgupdate',uploadOptions.single("image"),UpdateImage)

router.post("/adminlogin",adminLogin)
router.post("/admin",checkAdmin)
router.get("/getallusers",getallusers)
router.post("/deleteuser/:id",deleteUser)
router.post("/newuser",UserCreation)
router.get("/fetchdata/:id",fectchuser)
router.post("/edit",updatename)




module.exports=router
