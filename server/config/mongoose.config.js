const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/spotify_project")
    .then(() => 
        console.log("WE IN THE DB BABY!"))
    .catch(err => 
        console.log("NOOOO SOMETHING WENT WRONG NOOO WHYYYYY", err));
