const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 3000;
const User = require('./models/user');


app.post('/signup', async (req, res) => {

  const user = new User({
    firstName: 'Akshay',
    lastName: 'Saini',
    emailId: 'akshay@gmail.com',
    password: 'akshay@123'
  });

  try {
    await user.save();
    res.send('User saved successfully');
  } catch (err) {
    res.status(400).send('Error saving user: ' + err.message);
  }

})



connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log('Server is running on ' + 'http://localhost:' + port);
    });
  }).catch((err) => {
    console.error('Database connection failed:', err);
  });

app.use("/", (err, req, res) => {
  if (err) {
    res.status(500).send("Wild card handling error!!");
  }
  console.log('use will matches all http (get, post, delete, put) request');
});

app.listen(port, () => {
  console.log('Server is running on ' + 'http://localhost:' + port);
});