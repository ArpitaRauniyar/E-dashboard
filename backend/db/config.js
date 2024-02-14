const mongoose = require('mongoose');
//mongoose.connect("mongodb://locolhost:27017/e-commerce");
const Connection = async()=>{
    try{
        let connectDatabase = await mongoose.connect
        ("mongodb+srv://arpita3388:arpita30@cluster0.mvyz79t.mongodb.net/e-commerce?retryWrites=true&w=majority")
        console.log("Database is connected Successfully")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = Connection
