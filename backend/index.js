const express = require("express");
const rootRouter = require('./routes/index');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');
const middleware = require('./middleware');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGOURI);

mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
    console.log("Error connecting to MongoDB", err);
});

// Apply middleware to all routes

// Apply the root router to the '/api/v1' path
app.use('/api/v1', rootRouter);
app.use(middleware);

app.listen(3000, () => {
    console.log("Listening at port 3000");
});
