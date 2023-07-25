var express=require("express")
var router=express.Router()
var Manager=require("../mongoose_schemas/topicmanager_schema")
var Post=require("../mongoose_schemas/post_schema")
var session=require('express-session')



router.use(function(req,res,next){
    res.setHeader("Cache-Control","no-cashe,no-store,must-revalidate");
    res.setHeader("Pragma","no-cache")
    res.setHeader("Expires","0");
    next();

})




router.use(
    session({
        secret:"secret-key",
        resave:false,
        saveUninitialized:true,
        cookie:{secure:false}
    })
)










router.get('/',(req,res)=>{
    
    Post.find({topic:req.session.manager.category}).then(response=>{
        console.log(response)
        const unapprovedPost=response.filter(post=>post.approved===0)


        if(!response || unapprovedPost.length===0){
        res.render('managerLogin',{message:"YOU ARE UP TO DATE"})
    }else{
            res.render('managerLogin',{data:unapprovedPost})
        }

    }) 

})

router.get("/login",function(req,res){
    res.render("login")
})



router.post('/login', (req, res) =>{
    var loginInfo=req.body
    Manager.findOne({email:loginInfo.email}).then(response=>{
        if(!response){
            res.render('login',{message:'INVALID EMAIL'})
        }
        else if(response.password==loginInfo.password){
            if(response.approved===1){
                req.session.manager=response
                res.redirect('/manager')
            }else{
                res.render('login',{message:"YOU ARE DISAPPROVED"})
            }
          
        }
        else{
            res.render('login',{message:'INVALID USER'})
        }
    })

})





router.get('/readmore/:id',(req,res)=>{
    var id=req.params.id
    Post.findById(id).then(response=>{
        res.render('readmore',{res:response})

    })

})


router.post('/readmore/:id',(req,res)=>{
    var id=req.params.id;
    var info=req.body;
    Post.findByIdAndUpdate(id,{approved:info.approved}).then(response=>{
        res.redirect('/manager')
    })
    

    })





    router.get("/approved",function(req,res){
        var category=req.session.manager.category
        Post.find({approved:1,topic:category}).then(response =>{

        res.render("approved",{res:response})
        })
    })
    
    router.get("/decline",function(req,res){
        var category=req.session.manager.category
        Post.find({approved:-1,topic:category}).then(response =>{

        res.render("decline",{res:response})
        })
    })
    




    router.get('/logout',(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    })









module.exports=router