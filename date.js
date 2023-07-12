//jshint esversion:6

exports.getDateHin=function(){
    var today= new Date();
    
    var options ={
        weekday: "long",
        day:"numeric",
        month:"long"
    };

    return today.toLocaleDateString("hi-IN",options);
}

exports.getDate=function(){
    var today= new Date();
    
    var options ={
        weekday: "long",
        day:"numeric",
        month:"long"
    };

    return today.toLocaleDateString("en-US",options);
}