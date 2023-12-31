//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
// const title = require(__dirname+"/compose.ejs")

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://lazimrayan:Lazimrayan99@cluster1.gx9pn1g.mongodb.net/blogDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String
})

const Post = mongoose.model("Post",postSchema);

const home = new Post({
  postTitle: "My First Blog",
  postContent: homeStartingContent
});

const posts = [];

app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find().then(function (foundPosts) {
    res.render("home", {
      postarray: foundPosts,
    });
  }).catch(function (error) {
    console.log(error);
    res.redirect("/"); // Handle error gracefully by redirecting or rendering an error page
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    AboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    ContactContent: contactContent,
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose",async function (req, res) {
  const post = new Post({
    postTitle: req.body.TitleData,
    postContent: req.body.PostData
  });
  await post.save();
  res.redirect("/");
});
app.get("/posts/:topic", function (req, res) {
  const requestedtitle = req.params.topic;
  Post.findOne({ postTitle: requestedtitle })
    .then(function (post) {
      if (post) {
        res.render("post", {
          title: post.postTitle,
          content: post.postContent
        });
      } else {
        console.log("Post not Found");
        res.redirect("/"); // Redirect to the home page if the post is not found
      }
    })
    .catch(function (error) {
      console.log(error);
      res.redirect("/"); // Redirect to the home page if there's an error
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
