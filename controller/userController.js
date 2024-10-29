const userService = require('../services/userService');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async(req, res)=>{    
    const body = req.body;
    const result = await userService.register(body);
    res.json({result});
}

const mobileVerifyController = async(req, res)=>{    
    const body = req.body;
    const id = req.params;
    const result = await userService.mobileVerify(body, id);
    res.json({result});
}

const emailVerifyController = async(req, res)=>{    
    const body = req.body;
    const id = req.params;
    const result = await userService.emailVerify(body, id);
    res.json({result});
}

const loginController = async(req, res)=>{    
    try {
        
        const user = await User.find({companyEmail:req.body.companyEmail});
       
        
        if(user === false){
             res.status(404).json({message:"User Not Found"});
             return
        }

    
        var passwordCheck = await bcrypt.compare(req.body.password, user[0].password);
        
        
        
       
        if(passwordCheck === false){
             res.status(401).json({message:"Invalid Password"});
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
            token:token
        });
    } catch (error) {
        if(error){
             res.status(500).json({message:error});
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
            res.status(500).json({message:error});
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
            res.status(201).json({data:jobResult, message:"Job Information added successfully!!!"})
        }
    } catch (error) {
        res.status(500).json({message:error});
    }
}

module.exports = {
    registerController,
    mobileVerifyController,
    emailVerifyController,
    interviewController,
    loginController,
    logoutController
}