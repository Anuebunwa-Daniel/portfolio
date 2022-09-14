require('dotenv').config()
const ejs = require('ejs')
const mongoose = require('mongoose')
const express =require('express')
const projectSchema =require('./projectSchema')
const path = require('path');
// const userSchema = require('./userSchema')
const bcrypt = require('bcrypt')
const cookieParser =require('cookie-parser')
// const fs = require('fs')
const jwt = require('jsonwebtoken')
const multer =require('multer')
const app  = express()
 const mongodb ='mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu'
//  'mongodb://localhost:27017/Edward'
  

//  process.env.MONGODB || 'localhost:27017/Edward'

mongoose.connect(mongodb)
.then(()=>{
     console.log("datebase connected")
}).catch((err)=>{
    console.log(err, "Database connection failed")
})


app.set('view engine', 'ejs')
app.use(cookieParser())
app.use('/assets', express.static('assets'))
app.use(express.urlencoded ({extended:true}))
app.use('/uploads', express.static('uploads'));


//storage
const Storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        cb(null, './uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage: Storage})


app.post('/upload', upload.single('image'), async(req, res)=>{
    try {
        const post = new projectSchema({
            desc : req.body.desc,
            img: req.file.path 
            // img: req.body.image
        });
       const result = await post.save() 
       console.log(result);
       res.render('success')
        // res.status(200).send(result)
    } catch (error) {
        res.render('failed')  
    //   res.status(404).send(error) 
    }
    
})

//home page
app.get('/', async(req, res)=>{
    res.render('index')
})

//contact page
app.get('/contact', async(req, res)=>{
    res.render('contact')
})

//project page
app.get('/project', async(req, res)=>{
    const allPosts = await projectSchema.find()
    res.render('project', {posts:allPosts})
})

//addProject page
app.get('/addProject', (req, res)=>{
    res.render('addProject')
})

//success page
app.get('/success', (req, res)=>{
    res.render('success')
})
//failed page
app.get('/failed', (req, res)=>{
    res.render('failed')
})

//posting the project page
// app.post('/project', (req,res)=>{
//     const details =req.body
//     console.log(details)
//     // res.render('success')

//     run()
//     async function run(){
//         try{
//             const projects = new projectSchema({
//                 img:req.body.image,
//                 desc:req.body.desc
//             })
//             // console.log(projects);
//             await projects.save()
//             res.render('success')
//         } catch(err){
//             console.log(err.message)
//             res.render('failed')
//         }
//     }
// })







const port =process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`App started on port 4000 or ${port}`);
})