const express=require('express')
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const RegisterUser=require('./model')
const middleware = require('./middleware')
mongoose.connect('mongodb+srv://chandu2002:chandu2002@cluster0.n1mep3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('Db connected'))
app.get('/',(req,res)=>{
    res.send('Hello')
    res.end()
    
})
app.post('/register',async(req,res)=>{
   try{
    const{username,email,password,confirmpassword}=req.body;
    let exist=await RegisterUser.findOne({email})
    if(exist){
        return res.status(400).send("user exists")
    }
    if(password!==confirmpassword){
        return  res.status(400).send('password not matched')
    }
    let newUser=new RegisterUser({
        username,
        email,
        password,
        confirmpassword
    })
     newUser.save();
    res.status(200).send('registered')
}
    catch(err){
        console.log(err)
    }
})
app.post('/login',async(req,res)=>{
    try{
    const{email,password}=req.body;
    let exist=await RegisterUser.findOne({email})
    if(!exist){
        return res.status(400).send("user does not exists")
    }
    if(exist.password!==password){
        return  res.status(400).send('invalis password')
    }
    let payload={
        user:{
            id:exist.id
        }
    }
    jwt.sign(payload,'keySecret',{expiresIn:3600000},(err,token)=>{
        if(err) throw err;

        return res.json({token})
    })
    }
    catch(err){
        console.log(err)
    }
})
app.get('/myprofile',middleware,async (req,res)=>{
    try{
        let exist=await RegisterUser.findById(req.user.id)
        if(!exist){
            return  res.status(400).send('not found')
        }
        res.json(exist)
    }
    catch(err){
        console.log(err);
    }
})
app.listen(5000,()=>console.log('Server running....'))