//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");
const _ = require("lodash");

// var item = [];
var workItem = [];

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema);

//default documents.
const wel = new Item({
    name: "Welcome to your todoList"
});
const plu = new Item({
    name: "Hit + to add an item"
});
const dele = new Item({
    name: "<-- hit to delete item"
});

const defaultItems = [wel,plu,dele];
const listSchema = new mongoose.Schema({
    name: String,
    items:[itemSchema]
});
const List = mongoose.model("List", listSchema);



app.get("/", async function(req,res){
    const foundItems = await Item.find({});
    if(foundItems.length===0){
        Item.insertMany(defaultItems);
        res.redirect("/");
    }
    else{
        res.render("list",{listTitleHin:date.getDateHin(),listTitle:"Today",newListItem: foundItems});
    }
});

app.post("/",async function(req,res){
    // if(req.body.list ==="Work"){
    //     workItem.push(req.body.newItem);
    //     res.redirect("/work");
    // }
    // else{
    //     item.push(req.body.newItem);
    //     res.redirect("/");
    // }

    const itemName = req.body.newItem;
    const listTitle = req.body.list;
    const item = new Item({
        name: itemName
    });

    if(listTitle == "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        //adding items to custom lists
        const foundList = await List.findOne({name:listTitle}).exec();
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listTitle);
    }
});

app.post("/delete", async function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    //loging as well to get confirmation of deletion
    //console.log(await Item.deleteOne({ _id: checkedItemId }));
    if(listName=="Today"){
        await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
    }
    else{
        await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}});
        res.redirect("/"+listName);
    }
    
});

// app.get("/work", function(req,res){
    
//     res.render("list", {listTitle:"Work", newListItem: workItem, listTitleHin:date.getDateHin()})
// });

//EXPRESS ROUTE PARAMETERS
app.get("/:customListName", async function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    const foundList = await List.findOne({name:customListName}).exec();
    if( foundList== null){
        //create new list
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        list.save();
        res.redirect(customListName);
    }
    else{
        //show list
        res.render("list",{listTitleHin:date.getDateHin(),listTitle:foundList.name,newListItem: foundList.items});

    }
    
}); 

app.get("/about", function(req,res){
   res.render("about"); 
});

//commented during v1 itself
// app.post("/work",function(req,res){
//     var item = req.body.newItem;
//     workItem.push(newItem);
//     res.redirect("/work");
// })
app.listen(3000,function(){
    console.log("Server started on port 3000");
});
