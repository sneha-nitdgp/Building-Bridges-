const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
const accountSid = 'ACac7e7a383e47c6ea4a3014c64b88a914'; 
const authToken = '8eea816162b4c8fd1989f469c9a6c130'; 
const client = require('twilio')(accountSid, authToken); 


mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  email = req.body.email;
  phone = req.body.phone;
  //SMS
  console.log(phone)
  client.messages 
      .create({    
         from: '+15017122661',     
         to: '+917980386411',
         body: 'CONTENT',
       }) 
      .then(message => console.log(message.sid)) 
      .done();
  client.messages
    .create({
      from: 'whatsapp:+14155238886',
      body: 'CONTENT',
      to: 'whatsapp:' + phone
    })
    .then(message => console.log(message.sid));
  //EMAIL
  
  res.redirect('/');
})

app.get('/blog', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
app.use('/articles', articleRouter)
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(5000)