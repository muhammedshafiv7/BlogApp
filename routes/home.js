var express=require("express")
var router=express.Router()
var Manager=require("../mongoose_schemas/topicmanager_schema")
var Post=require("../mongoose_schemas/post_schema")
var session=require('express-session')




router.get('/',(req,res)=>{
    Post.find({approved:1}).then(response=>{
        res.render('home',{res:response})
    })
    
}
)



module.exports=router