if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");
const Article = require("./models/article");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware");

const articleRoutes = require("./routes/articles");
const userRoutes = require("./routes/users");

const dbUrl = process.env.DB_URL;

// 'mongodb://localhost:27017/blog-site'

mongoose.connect(dbUrl || "mongodb://localhost:27017/blog-site");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("The Database is Connected!");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(mongoSanitize());

const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", userRoutes);
app.use("/", articleRoutes);

app.get("/", (req, res) => {
  res.send("This is working!");
});

// app.get('/test', async (req, res) => {
//   let article = await Article.find().sort({ createdAt: -1 });
//   article = article[0];
//   res.render('home', {article})
// })

app.get("/home", async (req, res) => {
  let article = await Article.find().sort({
    createdAt: -1,
  });
  let article1 = article[0];
  let article2 = article[1];
  let article3 = article[2];
  let article4 = article[3];

  res.render("testhome", {
    article1: article1,
    article2: article2,
    article3: article3,
    article4: article4,
    cssPath: "home.css",
  });
});

// app.get("/articles", async (req, res) => {
//   const articles = await Article.find().sort({ createdAt: "desc" });
//   res.render("articles/index", { articles });
// });

// app.get("/articles/new", isLoggedIn, (req, res) => {
//   res.render("articles/new");
// });

// app.post("/articles", isLoggedIn, async (req, res) => {
//   const article = new Article({
//     ...req.body.article,
//     createdAt: new Date(),
//   });
//   article.author = req.user._id;
//   await article.save();
//   res.redirect(`/articles/${article._id}`);
// });

// app.get("/articles/:id", async (req, res) => {
//   const article = await Article.findById(req.params.id).populate("author");
//   res.render("articles/show", { article });
// });

// app.get("/articles/:id/edit", isLoggedIn, async (req, res) => {
//   const article = await Article.findById(req.params.id);
//   res.render("articles/edit", { article });
// });

// app.put("/articles/:id", isLoggedIn, async (req, res) => {
//   const article = await Article.findByIdAndUpdate(req.params.id, {
//     ...req.body.article,
//   });
//   res.redirect(`/articles/${article._id}`);
// });

// app.delete("/articles/:id", isLoggedIn, async (req, res) => {
//   await Article.findByIdAndDelete(req.params.id);
//   res.redirect("/articles");
// });

app.listen(2000, () => {
  console.log("Listening");
});
