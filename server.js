const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Article = require('./models/article')
const User = require('./models/user')
const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')

const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(passport)

app.set('view engine', 'ejs')
app.use(express.urlencoded({  extended: false}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
    secret: 'hazard',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/articles', articleRouter)
app.use('/users', userRouter)

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://gugafrs1713:Bbmp5988@blog2.qexskz4.mongodb.net/?retryWrites=true&w=majority', { 
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  
})
.then(() => {
  console.log('Connected to database successfully!');
})
.catch((error) => {
  console.log('Error connecting to database:', error);
});

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ publishDate: 'desc' })
    res.render('articles/index', { articles: articles})
})

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))
app.listen(5000)