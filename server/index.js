const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require("./Routes/AuthRoutes")
const app = express()
const cookieparser = require("cookie-parser")


app.listen(4000,()=>{
    console.log("server started port 4000......");
})

mongoose.connect("mongodb://localhost:27017/jwt",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("BD connection is successfull");
})
.catch(err=>{
    console.log(err.message);
})

app.use(cors({
    origin:['http://localhost:3000'],
    methods:["GET","POST"],
    credentials:true
}))

app.use(cookieparser())
app.use(express.json());
app.use('/',authRoutes)