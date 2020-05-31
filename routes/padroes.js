const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/login',(req,res)=>{
    res.render("padroes/login");
});
router.get('/register',(req,res)=>{
    res.render('padroes/register');
});

module.exports = router;