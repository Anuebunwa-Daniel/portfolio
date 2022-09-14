const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')
const mongodb = 'mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu'
// 'mongodb://localhost:27017/Edward'
// /'|| 'localhost:27017/Edward'


mongoose.connect(mongodb)

    const projectSchema = new mongoose.Schema({
        img: String,
        desc: String,   
    })
module.exports =mongoose.model('post', projectSchema)
