const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var https = require('follow-redirects').https;
var fs = require('fs');



const register = async(data)=>{    
    const {name, password, phoneNo, companyName, companyEmail, employeeSize } = data;
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
    if(result){
       return ({data: result, message:"Kindly Check your Register Mobile and Email!!!", code:201});
    }else{
        return ({data: "", message:"your Register Not Successed, Try Again!!!", code:500});
    }
}


const mobileVerify = async(data, user)=>{    
    
    const dbData = await User.findById({_id:user.id},{mobileOTP:1, mobileVerify:1});
    try {
        if(dbData.mobileVerify === false){
        if(dbData.mobileOTP === data.mobileotp){
            const updateMobileVerify = await User.findByIdAndUpdate({_id:user.id}, {mobileVerify:true}, {new:true});
            return ({data:updateMobileVerify, message:"Mobile OTP Verification is Done"});
    }else{
        return ({data:"", message:"Mobile OTP Number is Invalid"});
    }}else{
        if(dbData.mobileOTP === data.mobileotp){
        return ({data:"", message:"Mobile OTP Number Already verified"});
        }else{
            return ({data:"", message:"Mobile OTP Number Already verified And Provide Mobile OTP Number is Invalid"});
        }
    }
    } catch (error) {
        console.log(error);
        
    }
}

const emailVerify = async(data, user)=>{    
    
    const dbData = await User.findById({_id:user.id},{emailOTP:1, emailverify:1});
    try {
        if(dbData.emailverify === false){
        if(dbData.emailOTP === data.emailotp){
            const updateEmailVerify = await User.findByIdAndUpdate({_id:user.id}, {emailverify:true}, {new:true});
            return ({data:updateEmailVerify, message:"Email OTP Verification is Done"});
    }else{
        return ({data:"", message:"Email OTP Number is Invalid"});
    }}else{
        if(dbData.emailOTP === data.emailotp){
        return ({data:"", message:"Email OTP Number Already verified"});
        }else{
        return ({data:"", message:"Email OTP Number Already verified And Provide Email OTP Number is Invalid"});

        }
    }
    } catch (error) {
        console.log(error);
        
    }
}




module.exports = {
    register,
    mobileVerify,
    emailVerify,
}


