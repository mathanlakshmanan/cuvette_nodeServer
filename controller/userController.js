const User = require('../models/userModel');
const Job = require('../models/jobModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var https = require('follow-redirects').https;
var fs = require('fs');


const registerController = async(req, res)=>{    
    const body = req.body;
    const {name, password, phoneNo, companyName, companyEmail, employeeSize } = body;
    const user = new User({
        name: name,
        password:bcrypt.hashSync(password, 8),
        phoneNo:phoneNo,
        companyName:companyName,
        companyEmail:companyEmail,
        employeeSize:employeeSize,
        emailOTP:Math.floor(Math.random() * 899999 + 100000),
        mobileOTP:Math.floor(Math.random() * 899999 + 100000)
    });
    var options = {
      'method': 'POST',
      'hostname': 'jjrpzv.api.infobip.com',
      'path': '/sms/2/text/advanced',
      'headers': {
          'Authorization': 'App 02e121c6d8cef1d9deb2facebb3b0515-88b94172-26e0-480f-be25-2b3a9f975c96',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      'maxRedirects': 20
  };
  
  var req = https.request(options, function (res) {
      var chunks = [];
  
      res.on("data", function (chunk) {
          chunks.push(chunk);
      });
  
      res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
      });
  
      res.on("error", function (error) {
          console.error(error);
      });
  });
  
  var postData = JSON.stringify({
    "messages": [
        {
            "destinations": [{"to":"919751677003"}],
            "from": "447491163443",
            "text": "Congratulations on sending your first message.\nGo ahead and check the delivery report in the next step."
        }
    ]
});
  
  req.write(postData);
  
  req.end();

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'mathankumarmca92@gmail.com',
          pass: 'hudqgfjfgnxrgbef'
        }
      });
      var mailOptions = {
        from: 'mathankumarmca92@gmail.com',
        to: 'mathankumarmca92@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `Hi Raja pandi this mail from nodejs ${user.emailOTP}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    const result = await user.save();
    
    const token = jwt.sign({id:result._id}, process.env.SECRET,
        {
            algorithm:"HS256",
            allowInsecureKeySizes:true,
            expiresIn:86400
        });

        const Value = {
            id:result._id,
            name:result.name,
            companyEmail:result.companyEmail,
            token:token, 
            code:200
        }
    
    if(result){
       res.status(201).json({data: Value, message:"Kindly Check your Register Mobile and Email!!!", code:201});
    }else{
        res.status(500).json({data: "", message:"your Register Not Successed, Try Again!!!", code:500});
    }
}

const mobileVerifyController = async(req, res)=>{    
    const body = req.body;
    const id = req.params;
    const dbData = await User.findById({_id:id},{mobileOTP:1, mobileVerify:1});
    try {
        if(dbData.mobileVerify === false){
        if(dbData.mobileOTP == body.mobileotp){
            const updateMobileVerify = await User.findByIdAndUpdate({_id:id}, {mobileVerify:true}, {new:true});
            res.status(200).json({data:updateMobileVerify, message:"Mobile OTP Verification is Done"});
    }else{
        res.status(304).json({data:"", message:"Mobile OTP Number is Invalid"});
    }}else{
        if(dbData.mobileOTP === data.mobileotp){
            res.status(304).json({data:"", message:"Mobile OTP Number Already verified"});
        }else{
            res.status(304).json({data:"", message:"Mobile OTP Number Already verified And Provide Mobile OTP Number is Invalid"});
        }
    }
    } catch (error) {
        console.log(error);
        
    }
}

const emailVerifyController = async(req, res)=>{    
    const body = req.body;
    const id = req.params;
    
    const dbData = await User.findById({_id:id},{emailOTP:1, emailverify:1});
    try {
        if(dbData.emailverify === false){
        if(dbData.emailOTP == body.emailotp){
            const updateEmailVerify = await User.findByIdAndUpdate({_id:id}, {emailverify:true}, {new:true});
            res.status(200).json({data:updateEmailVerify, message:"Email OTP Verification is Done"});
    }else{
        res.status(304).json({data:"", message:"Email OTP Number is Invalid"});
    }}else{
        if(dbData.emailOTP === data.emailotp){
            res.status(304).json({data:"", message:"Email OTP Number Already verified"});
        }else{
            res.status(304).json({data:"", message:"Email OTP Number Already verified And Provide Email OTP Number is Invalid"});

        }
    }
    } catch (error) {
        console.log(error);
        
    }
}

const loginController = async(req, res)=>{    
    try {
        
        const user = await User.find({companyEmail:req.body.companyEmail});
       
        
        if(user === false){
             res.status(404).json({message:"User Not Found", code:404});
             return
        }

    
        var passwordCheck = await bcrypt.compare(req.body.password, user[0].password);
        
        
        
       
        if(passwordCheck === false){
             res.status(401).json({message:"Invalid Password", code:401});
             return
        }
        
        const token = jwt.sign({id:user._id}, process.env.SECRET,
            {
                algorithm:"HS256",
                allowInsecureKeySizes:true,
                expiresIn:86400
            });
        
        res.status(200).json({
            id:user[0]._id,
            name:user[0].name,
            companyEmail:user[0].companyEmail,
            token:token, 
            code:200
        });
    } catch (error) {
        if(error){
             res.status(500).json({message:error, code:500});
             return;
        }
    }
    
}

const logoutController = async(req, res)=>{    
    try {
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).json({ message: 'You are logged out!' });
    } catch (error) {
        if(error){
            res.status(500).json({message:error, code:500});
            return;
       }
    }
}

const interviewController = async(req, res)=>{
    try {
        const newjob = new Job({
            jobtitle:req.body.jobtitle,
            jobdescription:req.body.jobdescription,
            experiencelevel:req.body.experiencelevel,
            addcandidate:req.body.addcandidate,
            enddate: req.body.enddate
        });
        const jobResult = await newjob.save();
        if(jobResult){
            res.status(201).json({data:jobResult, message:"Job Information added successfully!!!", code:201})
        }
    } catch (error) {
        res.status(500).json({message:error});
    }
}

const otpCheckController = async(req,res)=>{
    const otpStatus = await User.findById({_id:req.params.id});
    
    const status = {
        emailverify:otpStatus.emailverify, 
        mobileVerify:otpStatus.mobileVerify
    } 
    res.status(200).json({data:status, code:200});
}

module.exports = {
    registerController,
    mobileVerifyController,
    emailVerifyController,
    interviewController,
    otpCheckController,
    loginController,
    logoutController
}