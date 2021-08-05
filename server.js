require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const app = express();
connectDB();
app.use(cors());

app.use(express.json());
app.use(require('./routes'));
require('./config/passport')(passport);
app.use(passport.initialize());
app.listen(8000, () => {
	console.log('Server is started');
});
