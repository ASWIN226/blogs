const express=require('express');
const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors());
require('dotenv').config();


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


const mongoose=require('mongoose');
mongoose.connect(MONGO_URI)

.then((co)=>{
    console.log("connected")
})

.catch((err)=>{
    console.log(err)

})

const blogs=new mongoose.Schema({
    title:String,
    author:String,
    content:String,
    url:String
    
},{timestamps:true});

const blogg=mongoose.model('blogg',blogs);

app.get('/blogs',async (req,res) => {

    try {
        const blogs=await blogg.find();
        res.status(200).json(blogs);
        
    } catch (error) {
        res.status(500).json({err:error.message});
        
    }
    
});

app.post("/blogs", async (req, res) => {
    try {
        // Check if req.body is an array
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: "Request body must be an array" });
        }

        const newBlogs = await blogg.insertMany(req.body);  // ✅ Insert multiple blogs
        res.status(201).json({ message: "Blogs created successfully", data: newBlogs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/blogs', async (req, res) => {
    try {
      const blogs = await blogg.find();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  });

  app.get('/blogs/:id', async (req, res) => {
    try {
      const blog = await blogg.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  });
  
  






app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})


