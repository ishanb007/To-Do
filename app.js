//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

var item = [];
var workItem = [];

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("list",{listTitleHin:date.getDateHin(),listTitle:date.getDate(),newListItem: item});
});

app.post("/",function(req,res){
    if(req.body.list ==="Work"){
        workItem.push(req.body.newItem);
        res.redirect("/work");
    }
    else{
        item.push(req.body.newItem);
        res.redirect("/");
    }
});

app.get("/work", function(req,res){
    
    res.render("list", {listTitle:"Work", newListItem: workItem, listTitleHin:date.getDateHin()})
});

app.get("/about", function(req,res){
   res.render("about"); 
});
// app.post("/work",function(req,res){
//     var item = req.body.newItem;
//     workItem.push(newItem);
//     res.redirect("/work");
// })
app.listen(3000,function(){
    console.log("Server started on port 3000");
});
