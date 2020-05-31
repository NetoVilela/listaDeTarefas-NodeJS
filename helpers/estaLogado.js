module.exports={
    estaLogado:(req,res,next)=>{

        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error_msg","Faça login para ter acesso a essa função do nosso sistema.");
            res.redirect('/');
        }
    }

};