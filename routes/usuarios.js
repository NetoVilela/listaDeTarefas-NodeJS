const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

require('../models/Comentário');
const Comentario = mongoose.model('comentarios');

//* INÍCIO Listar comentários===========================================================
router.get('/',(req,res)=>{
    Comentario.find().lean().then((comentarios)=>{
        res.render('index',{comentarios: comentarios});
    });
});         
//* FIM Listar comentários===========================================================

//* INÍCIO Registro de Usuários
router.get('/register',(req,res)=>{
    res.render('usuarios/register');
});

router.post('/register',(req,res)=>{
    var erros=[];

    if(!req.body.nome || typeof req.body.nome == undefined){
        erros.push({texto: "Nome inválido. Tente outro"});
    }
    if(!req.body.email || typeof req.body.email == undefined){
        erros.push({texto: "Email inválido. Tente outro"});
    }
    if(!req.body.senha || typeof req.body.senha == undefined){
        erros.push({texto: "Senha inválido. Tente outro"});
    }
    if(req.body.senha.length <4){
        erros.push({texto: "Senha muito curta. Use uma senha com no mínimo 4 caracteres"});
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes. Tente novamente."});
    }

    if(erros.length>0){
        res.render("usuarios/register",{erros:erros});
    }else{

        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            
            if(usuario){
                req.flash("error_msg","Esse email já está sendo usado por outro usuário.");
                res.redirect('/register');
            }else{
                    //Armazeno o novo usuário na constante
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });
                    //Encriptando a senha
                bcrypt.genSalt(10, (erro, salt)=>{

                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{

                        if(erro){
                            req.flash("error_msg","Houve um erro durante o cadastrado do usuário.");
                            res.redirect('/register');
                        }else{
                                //O hash foi gerado e passado na função
                            novoUsuario.senha = hash;
                                //Salva o usuário
                            novoUsuario.save().then(()=>{

                                req.flash("success_msg","Usuário criado com sucesso");
                                res.redirect('/login');

                            }).catch((error)=>{

                                req.flash("error_msg","Houve um erro ao criar o usuário, tente novamente.");
                                res.redirect('/register');
                                
                            });
                        }

                    })

                });


            }

        }).catch((error)=>{
            req.flash("error_msg","Houve um erro interno.")
            res.redirect('/');
        });

    }
    

});

//* FIM Registro de Usuários

//* INÍCIO Login do Usuário
    router.get('/login',(req,res)=>{
        res.render("usuarios/login");
    });

    router.post('/login',(req,res,next)=>{
        
        passport.authenticate("local",{
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true    //Habilitando as mensagens flash
        })(req,res,next);

    })
//* FIM Login do Usuário

//* INÍCIO Logout do Usuário
    router.get('/logout',(req,res)=>{
        req.logout();
        req.flash("success_msg","Deslogado com sucesso!");
        res.redirect('/');
    })
//* FIM Logout do Usuário

module.exports = router;