const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');

require('../models/Comentário');
const Comentario = mongoose.model('comentarios');


//* INÍCIO Criar novo comentário===========================================================
route.post('/cadastrar',(req,res)=>{
    var erros=[];

    if(req.body.comentario.length<5){
        erros.push({texto: "Comentaŕio muito pequeno."});
    }
    if( !req.user){
        erros.push({texto: "É preciso estar logado para poder comentar."});
    }
    if(erros.length>0){
        res.render('usuarios/login',{erros: erros});
    }
    else{
            //Bloco para criar um novo comentário
        const novoComentario = new Comentario();
        novoComentario.autor = req.user.nome;
        novoComentario.texto = req.body.comentario;
        novoComentario.idUsuario = req.user._id;

        new Comentario(novoComentario).save().then(()=>{
            req.flash("success_msg","Comentário criado com sucesso!");
            res.redirect('/');
        }).catch((erro)=>{
            req.flash('error_msg',"Erro ao criar seu comentário, tente novamente.");
            res.redirect('/');
        });

    }
});
//* FIM Criar novo comentário===========================================================

//* INÍCIO Remover comentário===========================================================
route.get('/remover/:id/:idUsuario',(req,res)=>{
    // res.send('ids '+req.params.id+ ' id do usuario'+req.params.idUsuario);

    if(req.user == undefined){
        req.flash("error_msg","É necessário fazer login para poder apagar seus comentários");
        res.redirect('/');
    }else if(req.user._id !=req.params.idUsuario){
        req.flash("error_msg","Você só pode apagar seus comentários.");
        res.redirect('/');
    }else{

        Comentario.deleteOne({_id: req.params.id}).then(()=>{
            req.flash("success_msg","Comentário apagado com sucesso!");
            res.redirect('/');
        }).catch((error)=>{
            req.flash("error_msg","Não foi possível apagar o comentário, tente novamente.");
            res.redirect('/');
        });
        
    }

    
});
//* FIM Remover comentário===========================================================
module.exports = route;