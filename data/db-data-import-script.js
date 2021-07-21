const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../model/tour-model');
const env = require('dotenv');
env.config({ path: '../config.env' });

/* DB connection is taken form the config.env file. Here the DB connection string is the Mongo Atlas connction */
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser:true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(_con => {
  //console.log(con.connections);
  console.log('Mongo connection established!');
});

// Read json file:
const tours = JSON.parse(fs.readFileSync('tours-simple.json'));

//Import data into database:
const laodData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data loaded to DB successfully!');
    } catch(err){
        console.log('Err in loading data!');
    }
}

// Delete all data from Db:
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('All tours deleted in Db!')
    } catch(err) {
        console.log(`Err deleting data from Db............ ${err}`);
    }
}


console.log(process.argv);
const main = async () => {
    if(process.argv[2]==='--import'){
        await laodData();
        process.exit();
    }
    
    else if(process.argv[2]==='--delete'){
        await deleteData();
        process.exit();
    }
}


main();
/* To run this code use

    node standalone-script.js --delete
    node standalone-script.js --import
*/