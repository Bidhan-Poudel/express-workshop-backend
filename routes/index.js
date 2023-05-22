// Filename: routes/index.js

// Import user schema from models/userSchema.js
const userSchema = require('../models/userSchema');
const hashPassword  = require('../utils/hashPassword');

// Import and initialize router for http requests
const router = require('express').Router();



async function postRegisterUser(req,res){
    const {name,password,email,address,age}=req.body

    if( !name || !password || !email || !address || !age){
        return res.status(400).json({
            success:false,
            message:"Missing required fields",
            "name":name,
            "email":email,
            "address":address,
            "password":password,
            "age":age
        })
    }

    const userExists= await userSchema.exists({
        email
    })

    if(userExists){
        return res.status(400).json({
            success:false,
            message:"User with email already exists"
        })
    }

    const user= userSchema({
        name,password:await hashPassword(password),email,address,age
    })
    await user.save()

    return res.json(
        {
            success: true,
            message: "User created successfully."
        }
    )
}

router.post("/register", postRegisterUser)


async function getRegisterUser(req, res) {
    const user= await userSchema.find()
    return res.json(user);  
}
router.get('/register', getRegisterUser);



async function putRegisterUser(req,res){
    const {name,address,age,email,password}= req.body;
    const user = await userSchema.findOneAndUpdate({
        _id:req.params.id
    },{
        name,address,age,email,password:await hashPassword(password)
    },{
        new:true
    })
    return res.json(user);
}

router.put('/register/:id',putRegisterUser)



async function deleteRegisterUser(req,res){
    const user=await userSchema.findByIdAndDelete({_id:req.params.id});
    return res.json(user);
}
router.delete('/register/:id',deleteRegisterUser);

/**
 * GET api for fetching all users
 */
async function getAllUsers(req, res) {
    const {query}=req
    const users = await userSchema.find(query.search?{
        "name":query.search
    }:{});
    res.json(users);
    res.end();
}
router.get('/users', getAllUsers);

/**
 * GET api for fetching a user by id 
 */
async function getUserById(req, res) {
    const user = await userSchema.findOne({
        _id: req.params.id
    });
    res.json(user);
    res.end();
}
router.get('/users/:id', getUserById);

// /**
//  * POST api for creating a new user
//  */
async function addUser(req, res) {
    const { name, age } = req.body;
    const user = await userSchema.create({
        name,
        age
    });
    return res.json(user);
}
router.post('/users', addUser);

// /**
//  * PUT api for updating a user by id
//  */
async function updateUser(req, res) {
    const { name, age } = req.body;
    const user = await userSchema.findOneAndUpdate({
        _id: req.params.id
    }, {
        name,
        age
    }, {
        new: true
    });
    return res.json(user);
}
router.put('/users/:id', updateUser);

// /**
//  * DELETE api for deleting a user by id
//  */
async function deleteUser(req, res) {
    const user = await userSchema.findOneAndDelete({ _id: req.params.id });
    return res.json(user);
}
router.delete('/users/:id', deleteUser);

// Exports all the routes
module.exports = router;