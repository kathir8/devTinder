const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 3000;
const User = require('./models/user');
const { validateSignUpData, loginValidation } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {


  try {

    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, skills } = req.body;

    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash
    });

    await user.save();
    res.send('User saved successfully');
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }

});

app.post('/login', async (req, res) => {
  try {
    loginValidation(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = await user.getJWT();
    res.cookie('token', token);

    res.status(200).send('Login successful');

  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
})

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

// Fetch profile
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
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


app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Wild card handling error!!");
  }
  console.log('use will matches all http (get, post, delete, put) request');
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




app.listen(port, () => {
  console.log('Server is running on ' + 'http://localhost:' + port);
});