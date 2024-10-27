const User = require('../models/userModel');

checkDuplicateUserEmail = async(req, res, next)=>{
    
    const userData = await User.findOne({companyEmail:req.body.companyEmail});
    try {
        if(userData){
            res.status(400).send({message:"Failed Username is Already in use!!!"});
            return;
        }
        next();
    } catch (error) {
        res.status(500).send({message:error});
        return;
    }

    
}

const verifySignup = {
    checkDuplicateUserEmail
}

module.exports = verifySignup;

