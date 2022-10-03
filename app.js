const express = require('express');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`); // get the module date.js
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Database config
mongoose.connect("mongodb://localhost:27017/tasksDB");
const taskSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "A task must have a name"]
    },
    description: String,
    dueDate: Date
});

// Task model will be added to the tasks collection, and is based off the taskSchema
const Task = mongoose.model("Task", taskSchema);

const task = new Task({
    name: "Test task",
    description: "test task description for mongodb",
    dueDate: 'today'
});

// task.save(); // saves the task to the 'Tasks' collection in the tasksDB
// Task.insertMany([list of tasks], (error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Successfully added task to tasksDB");
//     }
// });



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