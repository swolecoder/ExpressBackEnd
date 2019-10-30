const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config();

mongoose
.connect(process.env.db, { useNewUrlParser: true, userUnifiedTopology: true })
.then(() => {
  console.log("Connected to DB");
})
.catch(err => {
  console.log("Error");
});
