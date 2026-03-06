const express = require('express');
const app = express();

const port = 3000;

const {userAuth, adminAuth} = require("./middlewares/auth");

// Request handler

//app.use("/route", rH, [rH2, rH3], rH4, rh5);

app.get('/admin', adminAuth, (req,res)=>{
    try {
        res.send("Admin route is working!!");
        throw new Error("random error");
        
    } catch (error) {
        res.status(500).send("try catch error!!");
    }
})

app.use("/user", userAuth);

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling the route user!!");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 2!!");
    // res.send("2nd Response!!");
    next();
  },

  (req, res, next) => {
    console.log("Handling the route user 3!!");
    // res.send("3rd Response!!");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 4!!");
    // res.send("4th Response!!");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 5!!");
    res.send("5th Response!!");
  }
);


app.get("/user/:userId",(req,res) => {
    console.log(req.params);
    res.send({ from: 'params', firstName: 'John', lastName: 'Doe' });
});

app.get("/user/",(req,res) => {
    console.log(req.query);
    res.send({ from: 'query', firstName: 'John', lastName: 'Doe' });
});

// req- /user, /user/xyz, /user/abc/def (only work on 'app.use' )
app.use("/user",(req,res) => {
    
    res.send({ from: 'query', firstName: 'John', lastName: 'Doe' });
});


app.use("/",(err,req,res) => {
    if(err){
        res.status(500).send("Wild card handling error!!");
    }
    console.log('use will matches all http (get, post, delete, put) request');
});


app.use("/dead",(req,res) => {
    res.send('this will not be executed because the above use will match all request');
});

app.listen(port, () => {
  console.log('Server is running on ' + 'http://localhost:' + port);
});