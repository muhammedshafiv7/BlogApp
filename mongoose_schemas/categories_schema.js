var mongoose=require('mongoose');


var categorySchema=mongoose.Schema({
    topic:String
})

var Categories=mongoose.model('Category',categorySchema)

module.exports=Categories;