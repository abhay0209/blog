//create user-api app
const exp=require('express')
const adminApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressAsyncHandler=require('express-async-handler') //to handle the async errors
const jwt=require('jsonwebtoken')
require('dotenv').config()
// const commonApp=require('./common-api')

let usercollection;
//get usercollection app middlewaare
adminApp.use((req,res,next)=>{
    usercollection=req.app.get('userscollection')
    next()
})

//user registration route
adminApp.post('/user',expressAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body
    //check for duplicete user based on username
    const dbuser=await usercollection.findOne({username:newUser.username})
    //if user found
    if(dbuser!=null){
        res.send({message:'User existed'})
    }else{
        //hash the password
        const hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace the password with hashed one
        newUser.password=hashedPassword
        //create user
        await usercollection.insertOne(newUser)
        //send response
        res.send({message:"user created"})
    }
}))



//user login
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body
    //check for username
    const dbuser=await usercollection.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"invalid username"})
    }else{
        //check for password
        const status=await bcryptjs.compare(userCred.password,dbuser.password)
        if(status===false){
            res.send({message:"Invalid password"})
        }else{
            //check for jwt token
            const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY_USER,{expiresIn:50})
            //send response
            res.send({message:'login success',token:signedToken,user:dbuser})
        }  
    }
}))



//get articles of all users
adminApp.get('/articles',expressAsyncHandler(async(req,res)=>{
    //get articles from express app
    const articlescollection=req.app.get('articlescollection')
    //get all articles
    let articlesList=await articlescollection.find().toArray()
    //send respond
    res.send({message:"articles",payload:articlesList})
}))

//exports adminApp
module.exports=adminApp