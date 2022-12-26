const User = require("../model/authModel");
const Token = require("../model/tokenModel");
const sendEmail = require("../utils/setEmail");
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const {expressjwt} = require("express-jwt")


// to register user
exports.userRegister = async (req, res) => {
  const {name,email,username,password} = req.body
  let user = await User.create({
    name: name,
    email: email,
    username: username,
    password: password,
  }); 

  if (!user) {
    return res.status(400).json({ error: "Something is missing" });
  }

  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();

  if (!token) {
    return res.status.json({ error: "Something is wrong" });
  }

  //sendMAil
  const url = `${process.env.CLIENT_URL}/emailconfirmation/${token.token}`
  sendEmail({
    from: "no-reply@expressecommerce.com",
    to: user.email,
    subject: "Email verification link",
    text: `Hello \n\n please verify your account by clicking below
            link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`, // gives http://localhost:4000/api/conformation/token
    html: `<a href='${url}'>Verify email </a>`
  });
  res.send(user);
};

// conforming the eamil
exports.postEmailVerification = (req, res) => {
  Token.findOne({ token: req.params.token }, (error, token) => {
    if (error || !token) {
      return res.status(400).json({ error: "invalid token" });
    }
    // if we found valid token then find valid user for that token
      User.findOne({ _id: token.userId }, (error, user) => {
        if (error || !user) {
          return res.status(400).json({ error: "we are not able to find user for this token" });
        }
         // check if user is already verified
         if (user.isVerified) {
          return res.status(400).json({ error: "The email is already present" });
        }
        // save the verified user
        user.isVerified = true;
        user.save((error) => {
          if (error) {
            return res.status(400).json({ error: error });
          }
          res.json({ message: "Congrats,your email has been verified" });
        });
      })
  });
};

exports.resendVerificationLink = async (req, res) => {
  // find the user
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email not found" });

  if (user.isVerified) {
    return res.status(400).json({ error: "The email is already present" });
  }

  // create token to store in database and send to verification link
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();

  if (!token) {
    return res.status.json({ error: "Something is wrong" });
  }
   //sendMAil
   sendEmail({
    from: "no-reply@expressecommerce.com",
    to: user.email,
    subject: "Email verification link",
    text: `Hello \n\n please verify your account by clicking below
            link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`, // gives http://localhost:4000/api/conformation/token
  });
  res.json({ message: "Verification link has been sent" });
}

// reset password link
exports.forgetPassword = async (req,res) => {
  // find the user
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email not found" });

  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();

  if (!token) {
    return res.status.json({ error: "Something is wrong" });
  }
   //sendMAil
   const url = `${process.env.CLIENT_URL}/resetpassword/${token.token}`
   sendEmail({
    from: "no-reply@expressecommerce.com",
    to: user.email,
    subject: "Reset password link",
    text: `Hello \n\n please reset your password by clicking below
            link:\n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
            html: `<a href='${url}'>Click here to reset your password</a>`
            // gives http://localhost:4000/api/resetpassword/token
  });
  res.json({ message: "Password reset link has been sent" });
}


// signin process
exports.signIn = async (req,res) => {
  const {email,password} = req.body
  
  // check if email is registered or not
  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({error:"Email is not registered"})
  }

  // if email found then check password for that email
  if(!user.authenticate(password)){
    return res.status(400).json({error:'email or password doesnot match'})
  }

  // check if user is verified or not
  if(!user.isVerified){
    return res.status(400).json({error:'verified your account'})
  }

  // now generate token with user id and jwt secret
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
  // store token in cookie
  res.cookie('myCookie',token,{expire:Date.now()+99999})

  // return user information to frontend
  const {_id,name,role} = user
  return res.json({token,user:{_id,name,email,role}})

}

//reset password
exports.resetPassword = async (req,res) => {
  let token = await Token.findOne({ token: req.params.token }) 
    if (!token) {
      return res.status(400).json({ error: "invalid token" });
    }
    
    // if we found valid token then find valid user for that token
      let user = await User.findOne({ _id: token.userId }) 
        if (!user){
          return res.status(400).json({ error: "we are not able to find user for this token" });
        }
        
        user.password = req.body.password
        user = await user.save()

        if(!user){
          return res.status(400).json({error:"failed to reset password"})
        } 
        res.json({message:"password has been reset"})  
}

//sign out
exports.signOut = (req,res) => {
  res.clearCookie('myCookie')
  res.json({message:"signout success"})
}

// user list
exports.userList = async (req,res) =>{
  const user = await User.find().select("-hashed_password").select("-salt")
  if(!user){
    return res.status(400).json({error:"something went wrong"})
  }
  res.status(200).send(user)
}

// get single user
exports.singleUser = async (req,res) =>{
  const user = await User.findById(req.params.id)
  if(!user){
    return res.status(400).json({error:"something went wrong"})
  }
  res.status(200).send(user)
}


//require signin
exports.requireSignin = expressjwt({
  secret:process.env.JWT_SECRET,
  algorithms:['HS256']
})