const path  =require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const adminRoutes = require('./routes/passengerRoute');

//Set up mongoose connection
mongoose.connect('mongodb+srv://Renuka:Renuka@cluster0.10ayp.mongodb.net/userservice',{useNewUrlParser: true , useUnifiedTopology: true})
  .then(()=>{
    console.log('connected to database!');
  })
  .catch(()=>{
    console.log('connection failed! ');
  });
  mongoose.set('useCreateIndex', true);

//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With ,Content-Type,Authorization ,Accept",
    "HTTP/1.1 200 OK",
    "append,delete,entries,foreach,get,has,keys,set,values,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.use("/api/passenger",adminRoutes);
//app.use("/api/doctorUser",doctorUserRoutes);

//listening to Port 3000
var server=app.listen(3000, function(){
    var port=server.address().port;
    console.log("listening to port "+port);
})