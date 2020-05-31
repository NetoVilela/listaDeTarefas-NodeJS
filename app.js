const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const userRouter = require('./routes/usuarios');
const defaultRouter = require('./routes/padroes');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

//Sessão
    app.use(session({
        secret: 'qualquerCoisa',
        resave: true,
        saveUninitialized: true
    }));

//Flash
    app.use(flash());

//Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg=req.flash("success_msg");
        res.locals.error_msg=req.flash("error_msg");
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
    mongoose.connect('mongodb://localhost/listadetarefas').then(()=>{
        console.log('Conectado ao mongoDB!');
    }).catch((error)=>{
        console.log("Erro ao conectar ao mongoDB.");
    });


//Rotas
    app.use('/',defaultRouter);
    app.use('/usuarios',userRouter)


app.listen(8081,()=>{
    console.log("Servidor rodando na porta 8081");
})