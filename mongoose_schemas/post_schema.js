var express=require("express")
var mongoose=require("mongoose")



var postSchema = mongoose.Schema({
    title: String,
    description: String,
    topic:String,
    content:String,
    date:String,
    userId:String,
    userName:String,
    approved:Number
 });

var Post=mongoose.model('Post',postSchema);

module.exports=Post;
