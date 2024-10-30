const express = require('express');
const router = express.Router()
const userController = require('../controller/userController');
const {verifySignup, authJwt} = require('../middlewares');

router.post('/register',[verifySignup.checkDuplicateUserEmail], userController.registerController);
router.put('/mobile_verify/:id', [authJwt.verifyToken],userController.mobileVerifyController);
router.put('/email_verify/:id', [authJwt.verifyToken],userController.emailVerifyController);
router.post('/interview', [authJwt.verifyToken],userController.interviewController);
router.get('/otpcheck/:id',userController.otpCheckController);
router.post('/login',userController.loginController);
router.get('/logout',userController.logoutController);


module.exports = router;