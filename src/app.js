const express = require('express');
const app = express();

const port = 3000;

// Request handler


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


app.use("/",(req,res) => {
    res.send('use will matches all http (get, post, delete, put) request');
});


app.use("/dead",(req,res) => {
    res.send('this will not be executed because the above use will match all request');
});

app.listen(port, () => {
  console.log('Server is running on ' + 'http://localhost:' + port);
});