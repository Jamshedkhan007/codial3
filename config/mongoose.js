const mongoose=require('mongoose');
const env=require('./environment');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://localhost/${env.db}`);

const db=mongoose.connection;

db.on('error',console.error.bind("Error connecting to mongodb",console));


db.once('open',function(){
    console.log("Connected to Database: MongoDB");
});


module.exports=db;