const express = require('express');
const router = express.Router();

router.use('/',(req,res)=>{
    res.send("INDEX");
});
router.use('/login',(req,res)=>{
    res.send("Login");
});
router.use('/register',(req,res)=>{
    res.send('Register');
});

module.exports = router;