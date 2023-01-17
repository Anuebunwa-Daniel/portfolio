const mongoose = require('mongoose')

const mongodb ="mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu"
// ||"mongodb://localhost:27017/Edward"



mongoose.connect(mongodb)

    const projectSchema = new mongoose.Schema({
      desc: String,
      url: String,

    })

  // module.exports = mongoose.model('post', projectSchema)

  const post = mongoose.model("post", projectSchema)
 module.exports ={post}
