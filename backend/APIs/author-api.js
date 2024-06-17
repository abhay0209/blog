//create author api
const exp=require('express');
const authorApp=exp.Router();
const bcryptjs=require('bcryptjs');
const expressAsyncHandler=require('express-async-handler') 
const jwt=require('jsonwebtoken')
require('dotenv').config()
const verifyToken=require('../Middleware/verifyToken')


let authorscollection;
let articlescollection
//let authorscollection app middleware
authorApp.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})

//user registration route  --public
authorApp.post('/author',expressAsyncHandler(async(req,res)=>{
    const newAuthor=req.body
    const dbauthor=await authorscollection.findOne({username:newAuthor.username})
    if(dbauthor!=null){
        res.send({message:'Author existed'})
    }else{
        const hashedPassword=await bcryptjs.hash(newAuthor.password,6)
        newAuthor.password=hashedPassword
        await authorscollection.insertOne(newAuthor)
        res.send({message:"Author created"})
    }
}))


//user login  --public
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const authorCred=req.body
    const dbauthor=await authorscollection.findOne({username:authorCred.username})
    if(dbauthor===null){
        res.send({message:'invalid author'})
    }else{
        const status=await bcryptjs.compare(authorCred.password,dbauthor.password)
        if(status===false){
            res.send({message:"Inavlid password"})
        }else{
            const signedToken=jwt.sign({username:dbauthor.username},process.env.SECRET_KEY,{expiresIn:'1d'})
            res.send({message:'login success',token:signedToken,user:dbauthor})
        }
    }
}))


//adding new article by author  --protected
authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{

    //get new article from client
    const newArticle=req.body
    //post to articles colection
    await articlescollection.insertOne(newArticle)
    //send res
    res.send({message:'New article created'})

}))


//modify article by author  --protected
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified article from client
    const modifiedArticle=req.body;
    //update by article id
    let result=await articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
    let latestArticle=await articlescollection.findOne({articleId:modifiedArticle.articleId})
    res.send({message:'Article modified',article:latestArticle})
}))



//soft delete an article  --protected
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const articleIdFromUrl=Number(req.params.articleId)
    //get article
    const articleToDelete=req.body

    if (articleToDelete.status===true){
        let modifiedArt=await articlescollection.findOneAndUpdate({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:'after'})
        res.send({message:'article deleted',payload:modifiedArt.status})
    }
    if (articleToDelete.status===false){
        let modifiedArt=await articlescollection.findOneAndUpdate({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:'after'})
        res.send({message:'article restored',payload:modifiedArt.status})
    }
    }
    //update status of article to false
    
))


//read articles of author  --protected
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get author's username from url
    const authorName=req.params.username
    //get articles whose status is true
    const articlesList=await articlescollection.find({username:authorName}).toArray()
    res.send({message:"List of articles",payload:articlesList})
}))

//exports author-app
module.exports=authorApp