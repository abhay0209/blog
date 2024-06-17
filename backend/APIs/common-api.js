const exp=require('express')
const commonApp=exp.Router();


commonApp.get('/common',(req,res)=>{
    res.send({message:'reply from common-app'})
})



module.exports=commonApp