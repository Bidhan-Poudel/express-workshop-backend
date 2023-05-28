// Filename: routes/index.js

// Import user schema from models/userSchema.js
const userSchema = require("../models/userSchema");
const hashPassword = require("../utils/hashPassword");
const checkPassword= require("../utils/checkPassword");
const {generateToken}= require("../utils/token");
const authMiddleware= require("../middleware/authMiddleware");
const registerSchema= require("../models/registerSchema");
// Import and initialize router for http requests
const router = require("express").Router();

//////////////////////////////////////////////////////////////////////////////////////////////////
async function postRegisterUser(req, res) {
  const { name, password, email, address} = req.body;

  if (!name || !password || !email || !address) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  if(name.trim().split(" ").length<2){
    return res.status(400).json({
      success:false,
      message:"Name with surnmae is required",
    })
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    return res.status(400).json({
      success:false,
      message:"Valid email is required"
    })
  }
  

  const userExists = await registerSchema.exists({
    email,
  });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User with email already exists",
    });
  }

  const user = registerSchema({
    name,
    password: await hashPassword(password),
    email,
    address,
  });
  await user.save();

  return res.json({
    success: true,
    message: "User created successfully.",
  });
}
router.post("/register", postRegisterUser);




async function getRegisterUser(req, res) {
  const user = await registerSchema.find();
  return res.json(user);
}
router.get("/register", authMiddleware, getRegisterUser);




async function getRegisterUserByID(req, res) {
  const user = await registerSchema.findById({ _id: req.params.id });
  return res.json(user);
}
router.get("/register/:id", getRegisterUserByID);





async function putRegisterUser(req, res) {
  const { name, address, email, password } = req.body;

  if (!name || !password || !email || !address ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }
  const user = await registerSchema.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      name,
      password: await hashPassword(password),
      email,
      address
    },
    {
      new: true,
    }
  );
  return res.json(user);
}
router.put("/register/:id", putRegisterUser);




async function deleteRegisterUser(req, res) {
  const user = await registerSchema.findByIdAndDelete({ _id: req.params.id });
  return res.json(user);
}
router.delete("/register/:id", deleteRegisterUser);

////////////////////////////////////////////////////////////////////////////////////////////////


async function loginUser(req,res){
  const {email,password}= req.body;

  const userExists = await registerSchema.findOne({
    email
  });

  if (!userExists) {
    return res.status(400).json({
      success: false,
      message: "User with email doesn't exist",
    });
  }

  const isPasswordCorrect= await checkPassword(password,userExists.password)

  if(!isPasswordCorrect){
    return res.status(400).json({
      success:false,
      message:"Password is incorrect"
    })
  }

  // generate access token for user
  const accessToken = generateToken({
    email,
    address:userExists.address,
    _id:userExists._id,
  })
  
  return res.json({
    success:true,
    message:"User logged in successfully",
    data:{
      accessToken
    }
  })
}
router.post("/login",loginUser);

//////////////////////////////////////////////////////////////////////////
/**
 * GET api for fetching all users
 */
async function getAllUsers(req, res) {
  console.log("from get users", req.user)
  const users = await userSchema.find();
  res.json(users);
  res.end();
}
router.get("/users",authMiddleware, getAllUsers);

/**
 * GET api for fetching a user by id
 */
async function getUserById(req, res) {
  const user = await userSchema.findOne({
    _id: req.params.id,
  });
  res.json(user);
  res.end();
}
router.get("/users/:id", getUserById);

// /**
//  * POST api for creating a new user
//  */
async function addUser(req, res) {
  const { name, age } = req.body;
  const user = await userSchema.create({
    name,
    age,
  });
  return res.json(user);
}
router.post("/users", addUser);

// /**
//  * PUT api for updating a user by id
//  */
async function updateUser(req, res) {
  const { name, age } = req.body;
  const user = await userSchema.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      name,
      age,
    },
    {
      new: true,
    }
  );
  return res.json(user);
}
router.put("/users/:id", updateUser);

// /**
//  * DELETE api for deleting a user by id
//  */
async function deleteUser(req, res) {
  const user = await userSchema.findOneAndDelete({ _id: req.params.id });
  return res.json(user);
}
router.delete("/users/:id", deleteUser);

///////////////////////////////////////////////////////////////////////////////////



// Exports all the routes
module.exports = router;
