const mongoose = require('mongoose')

const mongodb ="mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu"

mongoose.connect(mongodb)

    const regSchema = new mongoose.Schema({
      username: String,
      email: String,
      password:String
    })

  module.exports = mongoose.model('reg_details', regSchema)


