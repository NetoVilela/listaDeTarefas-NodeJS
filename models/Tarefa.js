const mongoose = require('mongoose');

const Tarefa = new mongoose.Schema({
    descricao:{
        type: String,
        required: true
    },
    feita:{
        type:Boolean,
        default: false
    }
});

mongoose.model('tarefas', Tarefa);