require("dotenv").config();
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const route = express.Router()
const Blog = require('../blog_schema')
const User = require('../user_schema')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs')
const multer = require('multer')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/content')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const content = multer({storage:storage})

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
    console.log(token)
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      res.cookie("token", token,{ httpOnly: true, secure: true, maxAge: 2* 60 * 60 * 1000 })
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }

route.get('/blog/admin-login-frondo', async (req,res)=>{
    try{
        res.render('login', {pageTitle: "Login"})
    }catch(error){
        console.log(error)
    }
})

route.get('/blogs/:id', async (req, res) => {
    try {
      let slug = req.params.id;
  
      const blog = await Blog.findOne({_id:slug});
  
      res.render('post', { 
        blog:blog, pageTitle: blog.title + " | Frondo"
      });
    } catch (error) {
      console.log(error);
    }
  
  });

route.post('/blog/admin-login-frondo', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 2* 60 * 60 * 1000 });
    res.redirect('/blog/admin/dashboard');

  } catch (error) {
    console.log(error);
  }
});

route.get('/blog/admin/dashboard', authMiddleware, async (req,res)=>{
    try{
        const blog = await Blog.find()
        res.render('dashboard', {blog, pageTitle: 'Dashboard'})
    }catch(error){
        console.log(error)
    }
})

route.get('/add-post', authMiddleware, async (req,res)=>{
    try{
        const blog = await Blog.find()
        res.render('add-post', {blog, pageTitle: "Add Post"})
    }catch(error){
        console.log(error)
    }
})


route.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
      const blog = await Blog.findOne({ _id: req.params.id , pageTitle: "Edit Post"});
  
      res.render('edit-post', {
        blog
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });

route.put('/edit-post/:id', content.single('image'), authMiddleware, async (req, res) => {
  try {

    if (!req.file){
        await Blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            snippet: req.body.snippet
      
          })
    }else{
        await Blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            snippet: req.body.snippet,
            body: req.body.body,
            image: req.file.filename
      
          })
    }

    res.redirect(`/edit-post/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});

route.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Blog.deleteOne( { _id: req.params.id } );
      res.redirect('/blog/admin/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });


route.post('/add-post', content.single('image'), authMiddleware, async (req, res) => {
  try {
    const newBlog = new Blog({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body,
        image: req.file.filename
  })  
  await newBlog.save()
  }catch(error){
    console.log(error)}})


module.exports = route