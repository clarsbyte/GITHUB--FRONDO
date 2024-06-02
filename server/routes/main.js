const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const route = express.Router()
const Blog = require('../blog_schema')

route.get('/', async (req,res) =>{
    try{
        res.render('index', {pageTitle: 'Home | Frondo'})
    } catch (err){
        console.log(err)
    }
})


route.get('/blogs', async (req,res)=>{
    try{
        const blog = await Blog.find()
        res.render('blog',{pageTitle:'Blogs | Frondo',
            blog: blog
        })
    }catch(error){
    console.log(error)
}})


route.get('/merch', async (req,res) =>{
    try{
        res.render('merch',{ pageTitle: 'Merchandise | Frondo'})
    } catch (err){
        console.log(err)
    }
})

route.get('/about-us', async (req,res) =>{
  try{
      res.render('about-us',{ pageTitle: 'About Us | Frondo'})
  } catch (err){
      console.log(err)
  }
})

route.post('/search', async (req, res) => {
    try {
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const blog = await Blog.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        blog,
        currentRoute: '/',
        pageTitle: 'Search | Frondo'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

module.exports = route ; 