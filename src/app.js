const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');
const port = 3000;

const User = require('./models/user');
const authRouter = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


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