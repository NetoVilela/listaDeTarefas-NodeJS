const mongoose = require('mongoose');

const Comentario = new mongoose.Schema({
    texto:{
        type: String,
        required: true
    },
    autor:{
        type: String,
        required: true
    },
    idUsuario:{
        type:String,
        required: true
    }
});

mongoose.model("comentarios",Comentario)