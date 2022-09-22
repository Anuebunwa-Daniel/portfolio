require('dotenv').config()
const multer = require('multer')
const express = require('express')
const upload = require('./utis/multer')
const {cloudinary} =require('./utis/cloudinary')
const mongoose = require('mongoose')
 const {post} = require('./projectSchema')
 const path = require('path')

const app = express()

const mongodb= "mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu"
// || "mongodb://localhost:27017/Edward"


mongoose.connect(mongodb)
.then(()=>{
     console.log("datebase connected")
}).catch((err)=>{
    console.log(err, "Database connection failed")
})


app.set('view engine', 'ejs')
app.use(express.json())
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended: false}));

app.get('/addProject', (req, res, next)=>{
    res.render('addProject')
})

app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/contact', (req, res)=>{
    res.render('contact')
})
app.get('/project', async(req, res)=>{
    const allPosts = await post.find()
    res.render('project', {posts:allPosts})
})

app.get('/success', (req, res)=>{
    res.render('success')
})
app.get('/failed', (req, res)=>{
    res.render('failed')
})


app.post('/project', upload.single('image'), async (req, res, next)=>{
    console.log("file details: "+ req.file)
    const result = await cloudinary.uploader.upload((req. file.path))
    // cloudinary.v2.uploader.upload(file, options).then(callback);
    console.log(result)
    const details =req.body
    
    run()
    async function run(){
        try{
        const newPost =new post({
            desc:details.desc,
            url: result.url
            
           
        })
        await newPost.save()
        res.render('success')

   
}catch(err){
    console.log(err)
    res.render('failed')
}
    }
    })



const port =process.env.PORT || 9000

app.listen(port,()=>{
    console.log('app started on port 9000')
})