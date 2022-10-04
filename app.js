const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const e = require('express');
const date = require(`${__dirname}/date.js`); // get the module date.js

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = 3000;

// --------- DATABASE CONFIG ---------
mongoose.connect("mongodb://localhost:27017/tasksDB");
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A task must have a name"]
    },
    // description: String,
    // dueDate: Date
});

// Task model will be added to the tasks collection, and is based off the taskSchema
const Task = mongoose.model("Task", taskSchema);

const taskListSchema = new mongoose.Schema({
    tasks: Array
});

// ------------------------- RUN APPLICATION ------------------------- //
app.get('/', (req, res) => {
    const day = date.getDate();

    Task.find({}, (error, tasks) => {
        if (error) {
            console.log(error)
        } else {
            res.render('list', {listName: day, newTasks: tasks});
        }
    }); // find all tasks

    // console.log(taskNames);
});

// Runs when a new task is added to the main page through the submit button('/')
app.post('/', (req, res) => {
    const taskName = req.body.newTask;
    const task = new Task({name: taskName});
    task.save(); // Add to DB

    res.redirect('/'); // Redirects to the home page to display
});

app.post('/delete', (req, res) => {
    console.log(req.body)
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});