const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 3000;
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {

  const user = new User(req.body);
  try {
    await user.save();
    res.send('User saved successfully');
  } catch (err) {
    res.status(400).send('Error saving user: ' + err.message);
  }

});

// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      return res.status(404).send('User not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('Error fetching user: ' + err.message);
  }

});


// Get all users
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send('User not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('Error fetching user: ' + err.message);
  }
});

// Delete user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send('Error deleting user: ' + err.message);
  }
});

// Update user by ID
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "age", "gender"];
    const isUpdateAllowed = Object.keys(data).every(v => ALLOWED_UPDATES.includes(v));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!");
    }

    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("User updated successfully");
  } catch (err) {

    res.status(400).send('Error updating user: ' + err.message);
  }
});


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