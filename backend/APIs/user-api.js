//create user-api app
const exp = require('express')
const userApp = exp.Router();
const bcryptjs = require('bcryptjs')
const expressAsyncHandler = require('express-async-handler') //to handle the async errors
const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyToken = require('../Middleware/verifyToken')
// const commonApp=require('./common-api')

let usercollection;
let articlescollection;
//get usercollection app middlewaare
userApp.use((req, res, next) => {
    usercollection = req.app.get('userscollection')
    articlescollection = req.app.get('articlescollection')
    next()
})

//user registration route --public
userApp.post('/user', expressAsyncHandler(async (req, res) => {
    //get user resource from client
    const newUser = req.body
    //check for duplicete user based on username
    const dbuser = await usercollection.findOne({ username: newUser.username })
    //if user found
    if (dbuser != null) {
        res.send({ message: 'User existed' })
    } else {
        //hash the password
        const hashedPassword = await bcryptjs.hash(newUser.password, 6)
        //replace the password with hashed one
        newUser.password = hashedPassword
        //create user
        await usercollection.insertOne(newUser)
        //send response
        res.send({ message: "User created" })
    }
}))



//user login  --public
userApp.post('/login', expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body
    //check for username
    const dbuser = await usercollection.findOne({ username: userCred.username })
    if (dbuser === null) {
        res.send({ message: "invalid username" })
    } else {
        //check for password
        const status = await bcryptjs.compare(userCred.password, dbuser.password)
        if (status === false) {
            res.send({ message: "Invalid password" })
        } else {
            //check for jwt token
            const signedToken = jwt.sign(
                { username: dbuser.username },
                process.env.SECRET_KEY,
                { expiresIn: '1w' })
            //send response
            res.send({
                message: 'login success',
                token: signedToken,
                user: dbuser
            })
        }
    }
}))



//get articles of all authors  --protected
userApp.get('/articles', verifyToken, expressAsyncHandler(async (req, res) => {
    //get articles from express app
    const articlescollection = req.app.get('articlescollection')
    //get all articles
    let articlesList = await articlescollection.find({ status: true }).toArray()
    //send respond
    res.send({ message: "articles", payload: articlesList })
}))



//post comments for an article by article id  --protected
userApp.post('/comment/:articleId', verifyToken, expressAsyncHandler(async (req, res) => {
    //get user comment object
    const userComment = req.body;
    const articleId = Number(req.params.articleId)
    console.log(userComment)
    //insert userComment obj to comments array of article by id
    let result = await articlescollection.updateOne({ articleId: articleId }, { $addToSet: { comments: userComment } })
    console.log(result)
    res.send({ message: "comment posted" })
}))

//exports userApp
module.exports = userApp