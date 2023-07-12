//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

var item = [];

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){

    var today= new Date();
    
    var options ={
        weekday: "long",
        day:"numeric",
        month:"long"
    };
   var day = today.toLocaleDateString("en-US",options);
    var dayHin = today.toLocaleDateString("hi-IN",options);
    
    res.render("list",{dayHin:dayHin,day:day,newListItem: item});
});

app.post("/",function(req,res){
    item.push(req.body.newItem);
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
})