var express=require("express")
var router=express.Router()
var session=require('express-session')
var User=require('../mongoose_schemas/userschema')
var Post=require("../mongoose_schemas/post_schema")
const Categories = require("../mongoose_schemas/categories_schema")


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



router.get('/login',(req,res)=>{
    res.render('login')
}
)

router.post('/login', (req, res) =>{
    var loginInfo=req.body
    User.findOne({email:loginInfo.email}).then(response=>{
        if(!response){
            res.render('login',{message:'INVALID EMAIL'})
        }
        else if(response.password==loginInfo.password){
            if(response.approved===1){
                req.session.user=response;
                res.redirect('/user')
            }else{
                res.render('login',{message:"YOU ARE DISAPPROVED"})
            }
          
        }
        else{
            res.render('login',{message:'INVALID USER'})
        }
    })

})


router.get('/createpost',(req,res)=>{
    Categories.find().then(response=>{
        res.render('createPost',{cat:response})

    })
})


router.post('/createpost',(req,res)=>{
    var info=req.body
    var d=new Date()
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    var time=day+'/'+month+'/'+year;
    var userId=req.session.user._id
    var userName=req.session.user.name

    var newPost= new Post({
        title:info.title,
        description:info.description,
        topic:info.topic,
        content:info.content,
        userId:userId,
        userName:userName,
        date:time,
        approved:0
    })

    newPost.save().then (response =>{
        console.log(response)
        res.redirect('/user')
    })
})










router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/',(req,res)=>{
    if(req.session.user){
        Post.find({approved:1}).then(response=>{
            res.render('userLogin',{res:response})
        })
        
    }else{
        res.redirect('/')
    }
    
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.post('/signup',(req,res)=>{
    var userInfo=req.body;
    User.findOne({email:userInfo.email}).then(response =>{
        if(response){
            res.render('signup',{message:"USER ALREADY EXISTED !"})
        }else{
            var newUser=new User({
                name:userInfo.name,
                email:userInfo.email,
                password:userInfo.password,
                date:new Date(),
                type:1,
                approved:1

            });
            newUser.save().then(response=>{
                    req.session.user=newUser;
                    res.redirect('/user')
            })
        }
       
    })
    var newUser = new User({
       
     });
       
    
})


router.get('/readmoreUser/:id',(req,res)=>{
    var id=req.params.id
    Post.findById(id).then(response=>{
        res.render('readmoreUser',{res:response})

    })

})


router.get('/managepost',(req,res)=>{
    var uid= req.session.user._id
    Post.find({userId:uid}).then(response=>{
        res.render('managePost',{res:response})
    })
})



router.get('/editpost/:id',(req,res)=>{
    var id=req.params.id

    Post.findById(id).then(response=>{
        res.render('editPost',{cat:response})

    })
})



router.post('/editpost/:id',(req,res)=>{
    var id=req.params.id
    var info=req.body

    Post.findByIdAndUpdate(id,{

        title:info.title,
        description:info.description,
        topic:info.topic,
        content:info.content,
        approved:0
    }).then(response =>{
        res.redirect('/user/managepost')
    })
})


router.get('/deletePost/:id',(req,res)=>{
    var id=req.params.id
    Post.deleteOne({_id:id}).then(response=>{
        res.redirect('/user/managepost')
    })


})




module.exports=router