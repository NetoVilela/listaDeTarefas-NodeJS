const mongoose = require('mongoose');

const Usuario = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type:String,
        required: true
    },
    tarefasDoUsuario:{
        type: Array,
        required: true
    }
});

mongoose.model('usuarios', Usuario);
