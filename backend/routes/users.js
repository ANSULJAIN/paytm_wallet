const express = require('express')
const {User,Acount} = require('../db')

const router = express.Router()
const zod = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const middleware = require('../middleware')

const signupBody = zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname: zod.string(),
    password:zod.string()
})
router.post('/singup',async(req,res)=>{
    const {success} = signupBody.safeParse(req.body)
    if(!success) return res.status(411).json({error:'incorrect input'})
    const existinguser = await User.findOne({
username:req.body.username})
console.log(existinguser);
if (existinguser) {
    return res.status(411).json({
        message: "Email already taken/Incorrect inputs"
    })
}

const user = await User.create({
    username:req.body.username,
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    password:req.body.password
})
const userId = user._id;
const balance =  1+Math.random()*1000;
await Acount.create({
    userId,
   balance
})

const token = jwt.sign({
    userId
}, JWT_SECRET);

res.json({
    message: "User created successfully",
    token: token
})
})
const singinBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post('/singin',async(req,res)=>{
    const {success} = singinBody.safeParse({
        username:req.body.username,
        password:req.body.password
    })
const username = req.username ;
    if (!success) return res.status(411).json({error:'invalid input '})


  const savedUser = await  User.findOne({ username: req.username })
   
        if (!savedUser) {
            return res.status(422).json({ error: "invalid email or password" })
        }
      const doMatch = await  bcrypt.compare(password, savedUser.password)
           
                if (doMatch) { const token = jwt.sign({userId:savedUser._id},JWT_SECRET)
            res.json({token:token}) }
                else {
                    res.status(422).json({ error: "invalid password" })
                }
           
   

})

const udatedata = zod.object({
    password:zod.string().optional(),
    lastname:zod.string().optional(),
    firstname:zod.string().optional()

})
console.log(middleware)
router.put('/update',middleware,async(req,res)=>{
    const {success} = udatedata.safeParse(req.body)
    if(!success){
        res.status(411).json({error:"error in the authentication"})
    }
    await User.updateOne(req.body,{_id:req.userId})
    res.json({message:"udated succesfuly"})
})
router.post('/bulk',(req,res)=>{
  const filter = req.query.filter || "";
  
  const users = User.find({ $or:[
   {
        firstname:{"$regex":filter}
    },
    {
        lastname:{"$regex":filter}
    }
  ]}
  )
  res.json({
    user: users.map(user =>( {
        username:user.username,
        firstname:user.firstname,
        lastname:user.lastname,
        _id:user._id

        
    }))
  })

})


module.exports = router