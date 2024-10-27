const mongoose = require('mongoose');
require('dotenv').config();


const DBConect = async()=>{
try {
    const conn = await mongoose.connect(process.env.DBURL);
      console.log(`MongoDB Connected`);
} catch (error) {
    console.log(error);
    process.exit(1);
}
};

module.exports = DBConect;