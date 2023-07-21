var express=require("express")
var router=express.Router()
const admin = require("../mongoose_schemas/admin_schema")
var User=require("../mongoose_schemas/userschema")
 var Manager=require("../mongoose_schemas/topicmanager_schema")


router.get("/login",function(req,res){
    res.render("login")
})


router.get('/edit/:id',(req,res)=>{
    var id=req.params.id;
    User.findById(id).then(response=>{
        res.render('editUser',{user:response})
    })
})

router.post('/edit/:id',(req,res)=>{
    var id=req.params.id;
    console.log(id)
    var update=req.body
    User.findByIdAndUpdate(id,{
        name:update.name,
        email:update.email,
        password:update.password,
        type:update.type,
        approved:update.approved
    }).then(response=>{
        res.redirect('/admin')
    })
    

})


router.get('/logout',(req,res)=>{
    res.redirect('/admin/login')
})



router.get("/",function(req,res){
    User.find().sort({_id:-1}).then(response=>{
        res.render('adminLogin',{usr:response})
    })

    
    
})

router.post("/login",function(req,res){
    var loginInfo=req.body
    admin.findOne({email:loginInfo.email}).then(function (response){
        if(!response){
            res.render('login',{message:'INVALID EMAIL'})
        }
        else if(response.password===loginInfo.password){
            res.redirect("/admin")
        }
        else{
            res.render('login',{message:'INVALID PASSWORD'})
        }
    }).catch(function(error){
        console.log(error)
    })
})

router.get('/addManager',(req,res)=>{
    res.render('addManager')
})
 router.post('/addManager',(req,res)=>{
    var Info=req.body
    var newManager=new Manager({
        email:Info.email,
        password:Info.password,
        category:Info.category,
        approved:1
    })
    newManager.save().then (response=>{
        console.log(response)
        res.redirect('/admin')
    })
 })

 router.get("/viewManager",function(req,res){
    Manager.find().sort({_id:-1}).then(response=>{
        res.render('viewManager',{mngr:response})
    })

 })
 router.get('/editManager/:id',(req,res)=>{
    var id=req.params.id;
    Manager.findById(id).then(response=>{
        res.render('editManager',{manager:response})
    })
})

router.post('/editManager/:id',(req,res)=>{
    var id=req.params.id;
    console.log(id)
    var update=req.body
    Manager.findByIdAndUpdate(id,{
        email:update.email,
        password:update.password,
        approved:update.approved
    }).then(response=>{
        res.redirect('/admin/viewManager')
    })
    

})



module.exports=router