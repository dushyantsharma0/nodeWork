
const express=require('express');
const userSchma=require('../models/user');
const PostSchma=require('../models/postes');
const commentSchma=require('../models/comments');
const likesSchma=require('../models/likes');
const { populate } = require('dotenv');
const router=express();
const cors=require('cors');

router.use(cors());
router.get('/', function(req, res){
 res.send('Hello World');
})
router.get('/showposts', async function(req, res){
  const data = await PostSchma.find().populate([
    {
      path: 'author',
      select: 'name', // Selecting the 'name' field in the 'author' path
    },
    {
      path: 'comment',
      populate:{
        path: 'sender',
     
      }
    },   { path: "like",
    populate:{
     path: 'users'
    }
 }
  ]);
  res.send(data);
});

router.post('/usersave', async (req, resp) => {
    try {
      const realdata = await userSchma.findOne({ name: req.body.name });
      if (realdata) {
        if (req.body.Posts && req.body.Posts !== null) {
          if (Array.isArray(req.body.Posts)) {
            realdata.Posts.push(...req.body.Posts);
          } else {
            realdata.Posts.push(req.body.Posts);
          }
          const result = await realdata.save();
          resp.send(result);
        } else {
          resp.json({msg:" This name already registered take another name "})
        }
      } else {
        if (req.body.Posts && req.body.Posts !== null) {
          const newuser = new userSchma({
            name: req.body.name,
            Posts: Array.isArray(req.body.Posts) ? req.body.Posts : [req.body.Posts],
           
          });
          const result = await newuser.save();
          resp.send(result);
        } else {
          const newuser = new userSchma({
            name: req.body.name,
            bio: req.body.bio
          });
          const result = await newuser.save();
          resp.send(result);
        }
      }
    } catch (error) {
      resp.status(500).send(error.message);
    }
  });

  

 

  router.post('/posts', async (req, res) => {
    const author = req.body.author ? req.body.author : undefined;
    const comment = req.body.comment ? req.body.comment : undefined;
   
  
    const realdata = await PostSchma.findOne({ title: req.body.title });
  
    if (!realdata) {
      const newPost = new PostSchma({
        title: req.body.title,
        content: req.body.content,
        author,
        like:req.body.like,
        comment: comment ? [comment] : []  // If comment exists, create a new array with the comment, else create an empty array
      });
  
      const savedPost = await newPost.save();
      res.send(savedPost);
    } else {
      if(req.body.like){
        realdata.like=req.body.like;
      }
      if (req.body.author) {
        if (author) realdata.author = author;
      }
  
      if (req.body.comment) {
        if (comment) realdata.comment.push(comment);  // Push the new comment into the existing comments array
      }
  
      const updatedPost = await realdata.save();
      res.send(updatedPost);
    }
  });
//   save comment and author name 
 
 router.post('/comment', async(req,resp)=>{
    const data= await  commentSchma({
        text:req.body.text,
        sender:req.body.sender,
        Post:req.body.post

    })
    const result= await data.save()
    resp.send(result)

 })

 // todo: allposts post ka lea
 router.post('/allposts', async (req, res) => {
  const data=  await  userSchma.find().populate({
    path: 'Posts',
    populate: [
      { path: 'author' },
      { path: 'comment',
      populate:{
        path: 'sender',
     
      }
    
    }
      
    ]

    
  })
  res.send(data)
})
// todo: your post ka lea 
 
 router.post('/yourpost', async (req, res) => {
    const data=  await  userSchma.findOne({_id:req.body.user},{_id:0,posts:1}).populate({
      path: 'Posts',
      populate: [
        { path: 'author' },
        { path: 'comment',
        populate:{
          path: 'sender',
       
        }
      
      },
      { path: "like",
       populate:{
        path: 'users'
       }
    }
        
      ]

      
    })
    res.send(data)
 })

//  todo otherdata get 
 
router.post('/otherdata', async (req, res) => {
  try {
    const data = await userSchma.find({ _id: { $ne: req.body.user } },{_id:0,posts:1}).populate({
      path: 'Posts',
   populate: [
        { path: 'author' },
        { path: 'comment',
        populate:{
          path: 'sender',
       
        }
      
      } ,  { path: "like",
      populate:{
       path: 'users'
      }
   }
        
      ]
      
    })
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// todo: like impliment 
 
router.post('/like', async (req, res) => {
  try {
    const data = await likesSchma.findOne({ post: req.body.post });
    if (!data) {
      const like = new likesSchma({
        post: req.body.post,
        users: [req.body.user], // Assuming users is an array
      });
      const result = await like.save();
      res.send(result);
      console.log(result)
    } else {
      if (!data.users.includes(req.body.user)) {

        data.users.push(req.body.user); // Corrected property name to users
        const result = await data.save();
        res.send(result);
      } else {
        data.users = data.users.filter(user => user != req.body.user); // Corrected the removal of user
        const result = await data.save();
        res.send( result);
      }
     
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// find post by users 
router.post('/getsingleuserposts', async(req, res) => {
   try {
     const user= await userSchma.findOne({name:req.body.user },{_id:0,posts:1}).populate({
      path: 'Posts',
   populate: [
        { path: 'author' },
        { path: 'comment',
        populate:{
          path: 'sender',
       
        }
      
      } ,  { path: "like",
      populate:{
       path: 'users'
      }
   }
        
      ]
      
    })
     res.send(user);
    
   } catch (error) {
     res.status(500).send(error.message);
   }
})


module.exports=router