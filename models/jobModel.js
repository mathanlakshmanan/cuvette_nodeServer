const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobtitle:{
        type:String,
        required:true
    },
    jobdescription:{
        type:String,
        required:true
    },
    experiencelevel:{
        type:String,
        required:true
    },
    addcandidate:{
        type:String,
        required:true
    },
    enddate:{
        type:String,
        required:true
    }
});

const jobModel = mongoose.model('Job', jobSchema);

module.exports = jobModel;
