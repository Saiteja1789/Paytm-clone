const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const { User, Account } = require('../db.js'); 
const { authMiddleware } = require('../middleware.js');

const router = express.Router();
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName : zod.string(),
    password: zod.string(),
})
router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({message: "Email alraedy taken / Invalid inputs"});

    }
    const existingUser = await User.findOne({
        username:req.body.username
    })
    if (existingUser) {
        return res.status(411).json({message:"Email alraedy taken / Invalid inputs"})
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    

    const userId = user._id;
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000,
        
    })
    const token = jwt.sign({userId}, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

    
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req, res) => {
       const { success } = signinBody.safeParse(req.body);
       if (!success) {
          return res.status(411).json({message: "Error while logging in"});
       }
       
       const user = await User.findOne({
           username : req.body.username,
           password: req.body.password
       });

       if (user) {
           const token = jwt.sign({
            userId : user._id
           }, JWT_SECRET);
           res.json({
            token: token
           })
           return;
       }

       res.status(411).json({message: "Error while logging in"});

});

const userValidate = zod.object({
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.get('/bulk', authMiddleware, async(req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [
            {
                userName: {
                    $regex: filter
                }
            },
             {
                lastName: {
                    $regex: filter
                }
             }
        ]
    })

    res.json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id:user._id
        }))
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/user', authMiddleware ,async (req, res) => {
       const { success } = updateBody.safeParse(req.body);
       if (!success) {
        res.status(411).json({message: "Error while updating information"});

       } 

       await User.updateOne(req.body, { _id:req.userId});
       res.json({message: "Updated successfully"});
})



module.exports = router;