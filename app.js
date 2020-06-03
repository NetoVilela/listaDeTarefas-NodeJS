require('dotenv').config();
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const tarefaRouter = require('./routes/tarefas');
const usuarioRouter = require('./routes/usuarios');
const comentarioRouter =require('./routes/comentarios');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
// const helpers = require('handlebars-helpers')();

require('./config/auth')(passport);


//Sessão
    app.use(session({
        secret: 'qualquerCoisa',
        resave: true,
        saveUninitialized: true
    }));

//Passport
    app.use(passport.initialize());
    app.use(passport.session());

//Flash
    app.use(flash());

//Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg=req.flash("success_msg");
        res.locals.error_msg=req.flash("error_msg");
        res.locals.error=req.flash("error");
        res.locals.user=req.user || null;//Responsável por armazenar os dados do usuário logado
        next();
    });

//BodyParser
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

//Handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}));
    app.set('view engine', 'handlebars');

//MongoDB / Mongoose
    mongoose.Promise= global.Promise;
    mongoose.connect(`${process.env.MONGO_URL}`).then(()=>{
        console.log('Conectado ao mongoDB!');
    }).catch((error)=>{
        console.log("Erro ao conectar ao mongoDB.");
    });
    

//Rotas
    app.use('/',usuarioRouter);
    app.use('/tarefas',tarefaRouter);
    app.use('/comentarios',comentarioRouter);

app.listen(8081,()=>{
    console.log("Servidor rodando na porta 8081");
})