const express = require("express");
const passport = require("passport");
const router = express.Router();
const LocalStrategy = require("passport-local");
const { isLoggedIn } = require("../middleware");

const Article = require("../models/article");

router.get("/articles", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles, cssPath: "article-index.css" });
});

router.get("/articles/new", isLoggedIn, (req, res) => {
  res.render("articles/new");
});

router.post("/articles", isLoggedIn, async (req, res) => {
  const article = new Article({
    ...req.body.article,
    createdAt: new Date(),
  });
  article.author = req.user._id;
  await article.save();
  res.redirect(`/articles/${article._id}`);
});

router.get("/articles/:id", async (req, res) => {
  const article = await Article.findById(req.params.id).populate("author");
  res.render("articles/show", { article, cssPath: "show.css" });
});

router.get("/articles/:id/edit", isLoggedIn, async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article });
});

router.put("/articles/:id", isLoggedIn, async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, {
    ...req.body.article,
  });
  res.redirect(`/articles/${article._id}`);
});

router.delete("/articles/:id", isLoggedIn, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/articles");
});

module.exports = router;
