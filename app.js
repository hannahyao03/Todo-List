const express = require('express');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`); // get the module date.js
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tasksDB");

// Declare variables
const port = 3000;
const tasks = [];
const workTasks = [];

app.get('/', (req, res) => {
    const day = date.getDate();
    res.render('list', {listName: day, newTasks: tasks});
});

// Runs when a new task is added to the main page through the submit button('/')
app.post('/', (req, res) => {
    tasks.push(req.body.newTask);
    res.redirect('/'); // redirects to the home page
})

app.get('/work', (req, res) => {
    res.render('list', {listName: 'Work To-Do', newTasks: workTasks});
});

app.get('/work', (req, res) => {
    res.render('list', {listName: 'Work To-Do', newTasks: workTasks});
});

app.post('/work', (req, res) => {
    workTasks.push(req.body.newTask);
    res.redirect('/work');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});