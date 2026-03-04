const express = require('express');
const app = express();

const port = 3000;

// Request handler


app.use("/hello",(req,res) => {
    res.send('Hello Hello!');
});

app.use("/",(req,res) => {
    res.send('Vanakkam!');
});

app.listen(port, () => {
  console.log('Server is running on ' + 'http://localhost:' + port);
});