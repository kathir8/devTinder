const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');

const authRouter = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');
require('dotenv').config();

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
    app.listen(process.env.PORT, () => {
      console.log('Server is running on ' + 'http://localhost:' + process.env.PORT);
    });
  }).catch((err) => {
    console.error('Database connection failed:', err);
  });




app.listen(process.env.PORT, () => {
  console.log('Server is running on ' + 'http://localhost:' + process.env.PORT);
});