const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://vikashbtps08:Vikash94701@cluster0.gkgxmdp.mongodb.net/?retryWrites=true&w=majority");
const db=mongoose.connection;
db.on('error',console.error.bind(console,"Error connecting to MongoDB"));
db.once('open',function(){
    console.log("Connected to Database");
});
module.exports = db