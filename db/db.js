const mongoose = require("mongoose");

main()
 .then(() => {
     console.log("Database connected successfully");
 })
 .catch((err) => {
    console.log(err);
 })

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

module.exports = main;