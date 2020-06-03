const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Pega somente a função "estaLogado" contida no arquivo e depois cria uma variável com o nome "estaLogado"
const {estaLogado} = require('../helpers/estaLogado'); 

require('../models/Tarefa');
const Tarefa = mongoose.model('tarefas');

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

//* INÍCIO Criar nova tarefa===========================================================
    router.post('/addTarefa', estaLogado,(req,res)=>{
        var erros=[];

        if(req.body.descricao.length<4){
            erros.push({texto: "Tarefa muito pequena. Digite uma tarefa com no mínimo 4 letras."});
        }
        if(erros.length>0){
            res.render('tarefas/tarefas',{erros: erros});
        }else{
                //Bloco para criar uma nova tarefa
            const novaTarefa = new Tarefa();
            novaTarefa.descricao = req.body.descricao;
            novaTarefa.idUsuario = req.user._id;

            new Tarefa(novaTarefa).save().then(()=>{
                req.flash("success_msg","Tarefa criada com sucesso!");
                res.redirect('/tarefas/tarefas');
            }).catch((erro)=>{
                req.flash('error_msg',"Erro ao criar a tarefa");
                res.redirect('/tarefas/tarefas');
            });

        }
    });
//* FIM INÍCIO Criar nova tarefa===========================================================

//* INÍCIO Lista de tarefas===========================================================
    router.get('/tarefas', estaLogado,(req,res)=>{

        Tarefa.find({idUsuario: req.user._id}).lean().then((tarefas)=>{

            Tarefa.find({feita:false, idUsuario:req.user.id}).lean().then((tarefasPendentes)=>{
                var zero = tarefasPendentes.length == 0 ? true : false;
                res.render('tarefas/tarefas',{tarefas, tarefasPendentes, zero});
            }).catch((erro)=>{
                req.flash("error_msg","Não foi possível econtrar as tarefas pendentes.");
                res.redirect("/tarefas/tarefas");
            });
            
        }).catch((error)=>{
            req.flash("error_msg","Não foi possível encontrar as tarefas do usuário.")
        });
    });
//* FIM Lista de tarefas===========================================================

//*INÍCIO Remover Tarefa===========================================================
    router.get('/remover/:id', estaLogado,(req,res)=>{

        Tarefa.deleteOne({_id: req.params.id}).then(()=>{
            req.flash("success_msg","Tarefa removida com sucesso!");
            res.redirect('/tarefas/tarefas');
        }).catch((error)=>{
            req.flash("error_msg","Não foi possível apagar a tarefa do usuário.");
            res.render('tarefas/tarefas');
        });
    });
//*FIM Remover Tarefa===========================================================

//*INÍCIO Editar Tarefa===========================================================
    router.get('/editar/:id',estaLogado,(req,res)=>{    

        Tarefa.findOne({_id: req.params.id}).lean().then((tarefa)=>{
            res.render('tarefas/editTarefa',{tarefa: tarefa});
        }).catch((error)=>{
            req.flash('error_msg',"Erro ao editar a tarefa");
            res.redirect('/tarefas/tarefas');
        })
    });
    router.post('/editar', estaLogado,(req,res)=>{

        var erros=[];

        if(req.body.descricao.length<4){
            erros.push({texto: "Tarefa muito pequena. Digite uma tarefa com no mínimo 4 letras."});
        }
        if(erros.length>0){
            res.render(`editar/${req.body.id}`,{erros: erros});
        }else{

            Tarefa.findOne({_id: req.body.id}).then((tarefa)=>{

                tarefa.descricao = req.body.descricao;
                tarefa.save().then(()=>{
                    req.flash("success_msg","Tarefa editada com sucesso!");
                    res.redirect("/tarefas/tarefas");
                }).catch((erro)=>{
                    req.flash("error_msg","Não foi possível editar a tarefa, tente novamente.");
                    res.redirect('/tarefas/tarefas');
                });

            }).catch((error)=>{
                req.flash("error_msg","Erro ao editar a tarefa");
                res.redirect('/tarefas/tarefas');
            });

        }
    });
//*FIM Editar Tarefa===========================================================

//*INÍCIO Check Tarefa===========================================================
    router.get("/check/:id", estaLogado,(req,res)=>{

        Tarefa.findOne({_id: req.params.id}).then((tarefa)=>{
            tarefa.feita = true;

            tarefa.save().then(()=>{
                req.flash("success_msg","Parabéns por concluir essa tarefa!");
                res.redirect('/tarefas/tarefas');
            }).catch((error)=>{
                req.flash("error_msg","Infelizmente não foi possível salvar a tarefa realizada.");
                res.redirect("/tarefas/tarefas");
            });

        }).catch((error)=>{
                req.flash("error_msg","Não foi possível dar check nessa tarefa.")
                res.redirect("/tarefas/tarefas");
        });

    });
//*FIM Check Tarefa===========================================================


module.exports = router;