const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done)=>{

        Usuario.findOne({email: email}).then((usuario)=>{

            if(!usuario){//Os 3 params do done: os dados da conta autenticada, se a autenticacao aconteceu com sucesso e uma messagem
                return done(null, false, {message: "Essa conta não existe"});
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{

                if(batem){
                    return done(null, usuario);
                }else{
                    return done(null, false, {message: "Senha incorreta"});
                }

            });

        })

    }));

    passport.serializeUser((usuario, done)=>{

        done(null, usuario.id);

    })

    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (erro,usuario)=>{

            done(erro, usuario);

        })
    })

















}