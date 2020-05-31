const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Tarefa');
const Tarefa = mongoose.model('tarefas');

//* INÍCIO Criar nova tarefa
    router.post('/addTarefa',(req,res)=>{
        var erros=[];

        if(req.body.descricao.length<4){
            erros.push({texto: "Tarefa muito pequena. Digite uma tarefa com no mínimo 4 letras."});
        }
        if(erros.length>0){
            res.render('usuarios/tarefas',{erros: erros});
        }else{
                //Bloco para criar uma nova tarefa
            const novaTarefa = {descricao: req.body.descricao};
            new Tarefa(novaTarefa).save().then(()=>{
                req.flash("success_msg","Tarefa criada com sucesso!");
                res.redirect('/usuarios/tarefas');
            }).catch((error)=>{
                req.flash("error_msg","Não foi possível criar a tarefa");
                res.redirect('/usuarios/tarefas');
            });

        }
    });
//* FIM INÍCIO Criar nova tarefa

//* INÍCIO Lista de tarefas
    router.get('/tarefas',(req,res)=>{
        
        Tarefa.find().lean().then((tarefas)=>{
            Tarefa.find({feita: false}).lean().then((tarefasPendentes)=>{
                res.render('usuarios/tarefas',{tarefas, tarefasPendentes});    
            }).catch((error)=>{
                req.flash("error_msg","Não foi possível encontrar as tarefas pendentes");
                res.redirect('/');
            });
            
        }).catch((error)=>{
            req.flash('error_msg',"Não foi possível listar suas tarefas.");
            res.redirect('/');
        });

        
    });
//* FIM Lista de tarefas

//*INÍCIO Remover Tarefa
    router.get('/remover/:id',(req,res)=>{
        Tarefa.deleteOne({_id: req.params.id}).then(()=>{
            req.flash("success_msg","Tarefa removida com sucesso!");
            res.redirect('/usuarios/tarefas');
        }).catch((error)=>{
            req.flash("error_msg","Não foi possível remover a tarefa que possui esse ID.");
            res.redirect('/usuarios/tarefas');
        });
    });
//*FIM Remover Tarefa

//*INÍCIO Editar Tarefa
    router.get('/editar/:id',(req,res)=>{

        Tarefa.findOne({_id: req.params.id}).lean().then((tarefa)=>{
            res.render('usuarios/editTarefa',{tarefa:tarefa});
        }).catch((error)=>{
            req.flash('error_msg',"Não foi possível editar essa tarefa.");
            res.redirect('/usuarios/tarefas');
        });

    });
    router.post('/editar',(req,res)=>{

        Tarefa.findOne({_id: req.body.id}).then((tarefa)=>{
            tarefa.descricao= req.body.descricao

            tarefa.save().then(()=>{
                req.flash("success_msg","Tarefa editada com sucesso!");
                res.redirect('/usuarios/tarefas');
            }).catch((error)=>{
                req.flash("error_msg","Não foi possível salvar a alteração da tarefa.");
                res.redirect('/usuarios/tarefas');
            });

        }).catch((error)=>{
            req.flash("error_msg","Não foi possível editar sua tarefa.");
            res.redirect('/usuarios/tarefas');
        });

    });
//*FIM Editar Tarefa

//*INÍCIO Check Tarefa
    router.get("/check/:id",(req,res)=>{

        Tarefa.findOne({_id: req.params.id}).then((tarefa)=>{
            tarefa.feita = true;

            tarefa.save().then(()=>{
                req.flash("success_msg","Parabéns por essa tarefa!");
                res.redirect('/usuarios/tarefas');
            }).catch((error)=>{
                req.flash("error_msg","Infelizmente não foi possível salvar a tarefa realizada.");
                res.redirect("/usuarios/tarefas");
            });

        }).catch((error)=>{
                req.flash("error_msg","Não foi possível dar check nessa tarefa.")
                res.redirect("/usuarios/tarefas");
        });

    });
//*FIM Check Tarefa



module.exports = router;