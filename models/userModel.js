const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true
    },
    employeeSize:{
        type:String,
        required:true
    },
    emailOTP:{
        type:Number,
        required:true
    },
    mobileOTP:{
        type:Number,
        required:true
    },
    emailverify:{
        type:Boolean,
        default:false
    },
    mobileVerify:{
        type:Boolean,
        default:false
    },
});

const userModel = mongoose.model('CompanyInfo', userSchema);

module.exports = userModel;

