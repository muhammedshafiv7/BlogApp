var express=require("express")
var router=express.Router()
var session=require('express-session')
var User=require('../mongoose_schemas/userschema')


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

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/',(req,res)=>{
    if(req.session.user){
        res.render('userLogin')
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


module.exports=router