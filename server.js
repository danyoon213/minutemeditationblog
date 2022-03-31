if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const Article = require('./models/article');

const dbUrl = process.env.DB_URL;

// 'mongodb://localhost:27017/blog-site'

mongoose.connect(dbUrl || 'mongodb://localhost:27017/blog-site');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('The Database is Connected!')
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(mongoSanitize());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.send('This is working!')
})

// app.get('/test', async (req, res) => {
//   let article = await Article.find().sort({ createdAt: -1 });
//   article = article[0];
//   res.render('home', {article})
// })

app.get('/home', async (req, res) => {
  let article = await Article.find().sort({ createdAt: -1 });
  let article1 = article[0];
  let article2 = article[1];
  let article3 = article[2];
  let article4 = article[3];

  res.render('testhome', {article1: article1, article2: article2, article3: article3, article4: article4})
})

app.get('/articles', async (req, res) => {
  const articles = await Article.find().sort({createdAt: 'desc'});
  res.render('articles/index', {articles})
})

app.get('/articles/new', (req, res) => {
  res.render('articles/new');
})

app.post('/articles', async (req, res) => {
const article = new Article({...req.body.article, createdAt: new Date()});
await article.save();
res.redirect(`/articles/${article._id}`)
})

app.get('/articles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/show', {article});
})

app.get('/articles/:id/edit', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', {article});
})

app.put('/articles/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, {...req.body.article});
  res.redirect(`/articles/${article._id}`)
})

app.delete('/articles/:id', async(req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/articles');
})

app.listen(2000, () => {
  console.log('Listening')
})