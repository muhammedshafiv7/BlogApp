var express=require("express")
var app= express()
var mongoose=require("mongoose")
var bodyParser=require("body-parser")
var home_Router=require("./routes/home")
var user_Router=require("./routes/user")
var User=require("./mongoose_schemas/userschema")
var admin_Router=require("./routes/admin")










mongoose.connect('mongodb://127.0.0.1/blog_app');






app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static("/public/css"))
app.use(express.static("/public/image"))
app.use(express.static("/public/js"))
app.use('/',home_Router);
app.use('/user',user_Router);
app.use('/admin',admin_Router);





app.listen(9999)