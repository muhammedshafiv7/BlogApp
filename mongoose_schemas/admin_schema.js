var express=require("express")
var mongoose=require("mongoose")


var adminSchema = mongoose.Schema({
    
    email: String,
    password: String,
  
 });

var admin=mongoose.model('admin',adminSchema);

module.exports=admin;
