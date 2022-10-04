const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(`${__dirname}/date.js`); // get the module date.js

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = 3000;

// --------- DATABASE CONFIG ---------
mongoose.connect("mongodb://localhost:27017/tasksDB");
const taskSchema = new mongoose.Schema({
    name: String
    // description: String,
    // dueDate: Date
});

const Task = mongoose.model("Task", taskSchema);

const listSchema = new mongoose.Schema({
    name: String,
    tasks: [taskSchema]
});

const List = mongoose.model("List", listSchema);


// ------------------------- RUN APPLICATION ------------------------- //
app.get('/', (req, res) => {
    const day = date.getDate();

    // Display tasks in DB
    Task.find({}, (error, tasks) => {
        if (error) {
            console.log(error)
        } else {
            res.render('list', {listName: day, newTasks: tasks});
        }
    }); 

});


// Runs when a new task is added to the main page through the submit button('/')
app.post("/", (req, res) => {
    const taskName = req.body.newTask;
    
    // New task
    const task = new Task({name: taskName});
    task.save(); // Add to DB
    res.redirect('/'); // Redirects to the home page to display new task
});

app.get("/:customListName", (req, res) => {
    const listName = req.params.customListName;

    List.findOne({name: listName}, (error, result) => {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            if(!result) {
                // Add a new list if it does not exist
                const list = new List({
                    name: listName,
                    tasks: []
                });

                list.save();

                res.redirect(`/${listName}`);

            } else {
                // Display the pre-existing list with the same name
                res.render("list", {listName: result.name, newTasks: result.tasks});
            }
        }
    })
    
})

app.post('/delete', (req, res) => {
    const taskToDelete = req.body.delete;
    const listName = req.body.listName;

    if (listName = date.getDate()) {
        Task.findByIdAndDelete(taskToDelete, (error, deleteResult) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Successfully deleted : ${deleteResult}`);
            }
        });

        res.redirect('/'); // Redirects to the home page to update display    
    } else {
        console.log("Hi");
    }
    
});

app.post("/:customListName", (req, res) => {
    const taskName = req.body.newTask;
    const listName = req.params.customListName;

    if (listName == 'delete') {
        res.redirect('/delete');
    } else {
        // New task
        const task = new Task({name: taskName});

        List.findOne({name: listName}, (error, result) => {
            if (error) {
                console.log(`Error: ${error}`);
            } else {
                result.tasks.push(task); // Add the task to the custom list
                result.save();

                res.redirect(`/${listName}`);
            }
        })
    }
    
    
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});