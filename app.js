require('dotenv').config()
const multer = require('multer')
const express = require('express')
const upload = require('./utis/multer')
const { cloudinary } = require('./utis/cloudinary')
const mongoose = require('mongoose')
const { post } = require('./projectSchema')
const regSchema = require('./regSchema')
const path = require('path')
const session = require('express-session')
const expressValidator = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')

// 
const mongodb = 'mongodb+srv://dahumble:A123456s@edward.kkgo9lm.mongodb.net/tochukwu'



mongoose.connect(mongodb)
    .then(() => {
        console.log("datebase connected")
    }).catch((err) => {
        console.log(err, "Database connection failed")
    })

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//set global errors variable
app.locals.errors = null

//Expree session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Express validator
//the app use part
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))



//Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.get('/addProject',protectRoute, (req, res) => {

    var image = ""
    var desc = ""
    res.render('addProject', {
        image: "image",
        desc: "desc"

    })
})

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.get('/project', async (req, res) => {
    const allPosts = await post.find()
    res.render('project', { posts: allPosts })
})

app.get('/success', (req, res) => {
    res.render('success')
})
app.get('/failed', (req, res) => {
    res.render('failed')
})

app.get('/registerP', (req, res) => {
    var username = ""
    var email = ""
    var password = ""

    res.render('registerP', {
        username: username,
        email: email,
        password: password
    })
})

app.get('/login', (req, res) => {

    res.render('login', {

    })
})

app.get('/logout', (req, res)=>{
    res.cookie('token', '',{maxAge: 1})
    res.redirect('/')
 })


app.post('/addProject', upload.single('image'), async (req, res, next) => {
    const result = await cloudinary.uploader.upload((req.file.path))
    const details = req.body

    req.checkBody('desc', 'Description shouldnt be empty').notEmpty();
    var image = details.image
    var desc = details.desc


    var errors = req.validationErrors()
    if (errors) {
        res.render('addProject', {
            errors: errors,
            image: image,
            desc: desc
        })
    } else {
        var newPost = new post({
            desc: details.desc,
            url: result.url
        })
        newPost.save((err) => {
            if (err) return console.log(err)
            req.flash('success', 'project added')
            res.render('addProject')
        })
    }

})


app.post('/registerP', async (req, res) => {

    const salt = await bcrypt.genSalt(1)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // console.log(hashedPassword)

    var username = req.checkBody('username', 'choose a username').notEmpty();
    var email = req.checkBody('email', 'Email field is empty').notEmpty();
    var password = req.check('password', 'Password should contain number,lowercase,uppercase and should be 8 characters and above ').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");

    var errors = req.validationErrors();
    if (errors) {
        res.render('registerP', {
            errors: errors,
            username: username,
            email: email,
            password: password
        })
    } else {
        regSchema.findOne({ username: req.body.username }, (err, reg_details) => {
            if (reg_details) {
                req.flash('danger', 'username already exists')
                res.render('registerP')
            } else {
                var newPost = new regSchema({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword

                })
                console.log(newPost)
                newPost.save((err) => {
                    if (err) return console.log(err)
                    req.flash('success', 'successfully registerd')
                    res.render('registerP')
                })
            }
        })
    }
})


app.post('/login', async(req, res)=>{
    try {
        const userN = req.body.username
        const passW = req.body.password

        const username = req.checkBody('username', 'username field is empty').notEmpty();

        const password = req.check('password', 'password field is empty ').notEmpty();

        const errors = req.validationErrors()

        const result = await regSchema.findOne({username:userN})
        if (!result) {
            req.flash('danger', " username does not exist")
            res.render('login')
        } else {
            const validPassword = bcrypt.compare(passW, result.password)
            bcrypt.compare(passW, result.password, (err, data) => {
                                    // console.log(passW)
                                    console.log(result.password)
                                    if (data) {
                                        const payload = {
                                            user: {
                                                userN: result.username
                                            }
                                        }
                                        const token = jwt.sign(payload, 'odunze', {
                                            expiresIn: '3600s'
                                        })
                                        res.cookie('token', token, {
                                            httpOnly: true
                
                                        })
                                        res.redirect('/addProject')
                                    }else{
                                        req.flash('danger', " wrong password")
                                        res.render('login')
                                    }
                                })
        }
    } catch (error) {
        res.status(500).send(error) 
    }
})


// app.post('/login', (req, res) => {
//     const userN = req.body.username
//     const passW = req.body.password

//     var username = req.checkBody('username', 'username field is empty').notEmpty();

//     var password = req.check('password', 'password field is empty ').notEmpty();

//     var errors = req.validationErrors();



//     const detail = regSchema.findOne({userN})

    
//     .then((detail) => {
//         regSchema.findOne({ username:userN}, (err, reg_details) => {
//             if (!reg_details) {
//                 req.flash('danger', 'username does not exists')
//                 res.render('login')
//             } else {
//                 bcrypt.compare(passW, detail.password, (err, data) => {
//                     // console.log(passW)
//                     console.log(detail.password)
//                     if (data) {
//                         const payload = {
//                             user: {
//                                 userN: detail.username
//                             }
//                         }
//                         const token = jwt.sign(payload, 'odunze', {
//                             expiresIn: '3600s'
//                         })
//                         res.cookie('token', token, {
//                             httpOnly: true

//                         })
//                         res.redirect('/addProject')

//                     } else {
//                         req.flash('danger', 'incorrect password ')
//                         console.log(errors)
//                         res.render('login', {

//                             errors: errors,
//                             username: username,
//                             password: password
//                         })
//                     }
//                 })
//             }
                
//         }).clone().catch((err) => {
//             console.log(err)
//         })
//     })
// })

function protectRoute(req, res, next){
    const token = req.cookies.token
    try{
        const user = jwt.verify(token, 'odunze')

        req.user = user
        // console.log(req.user)
        next()
    }
    catch(err){
        res.clearCookie('token')
        return res.redirect('/login')
    }
}

const port = 9000

app.listen(port, () => {
    console.log('app started on port')
})