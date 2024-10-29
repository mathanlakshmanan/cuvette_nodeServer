const express = require('express');
const cors = require('cors');
const DBConect = require('./config/dbConnection');
const userRoute = require('./routes/userRoute');
require('dotenv').config();
const app = express();



DBConect();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use("/api/v1", userRoute);

let PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server running On Port : ${PORT}`);
    
})