const mongoose = require('mongoose');
const env = require('dotenv');
env.config({ path: './config.env' });
const app = require('./app');


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


/* App Listner */
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(`App connection to ${process.env.NODE_ENV} environment`);
});
