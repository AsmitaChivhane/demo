const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Passenger =require('../model/passenger');

router.get('/passengers',function(req, res) {
    Passenger.find(function(err, passenger) {
        if (err)
            res.send(err);

        res.json(passenger);
    });
});
//read the data from client application and match with Modal
// router.post("/users/registration", expressAsyncHandler(async (req,res)=>{
//     console.log("registration "+req.body);
//     const user = new Passenger({
//         name : req.body.name,
//         email : req.body.email,
//         password : req.body.password
//     });
//     const createdUser = await user.save();
//     res. send({
//         _id :  createdUser._id,
//         name : createdUser.name,
//         email : createdUser.email,
//         msg :"success",
//         token : generateToken(createdUser)
//     })
// }));
router.post("/signup", (req,res,next)=>{
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new Passenger({
          name : req.body.name,
          //contact : req.body.contact,
          //nic : req.body.nic,
          email : req.body.email,
          password : hash,
         // role: req.body.role
        });
  
        user.save()
          .then(result =>{
            res.status(201).json({
              message : 'User created!',
              result: result
            });
          })
  
          .catch(err =>{
            res.status(500).json({
              error :err
            });
          });
      })
  
  })
  router.post("/login" , (req, res ,  next)=>{
    let fetchedUser;
    Passenger.findOne({email: req.body.email}).then(user=>{
      if(!user){
        return res.status(401).json({
          token: "error",
          expiresIn: "error",
          role: "error",
          message: "Invalid Email (user email not registered)"
        });
      }
      fetchedUser=user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result =>{
      if(!result){
        return res.status(401).json({
          token: "error",
          expiresIn: "error",
          role: "error",
          message: "Invalid password please try again"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email , userId : fetchedUser ._id } ,
        'this_is_the_webToken_secret_key' ,
        { expiresIn : "1h"}
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          role: fetchedUser.role,
          message: "Logged in Successfully"
        });
    })
    .catch(err =>{
      return res.status(401).json({
        message: "Auth failed"
      });
    });
  })

// router.post("/users/signin",expressAsyncHandler(async (req,res)=>{
//     const user = await Passenger.findOne({"email":req.body.email});
//     console.log(user);
//     console.log(" req.body.password"+req.body.password);
//     console.log(" req.body.password"+req.body.password);
//     if(user){
//         if(req.body.password===user.password){
//             console.log("into this")
//             routes = "/user";
//             res.send({
//                 _id:user._id,
//                 name:user.name,
//                 email:user.email,
//                 route:routes,
//                 token : generateToken(user)
//             })
//         }else{
//             res.status(401).send({"message":"invalid password"});
//         }
//     }else{
//         res.status(401).send({"message":"invalid email or password"})
//     }
// }));

module.exports = router;