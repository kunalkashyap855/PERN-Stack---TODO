const express = require('express'),
      cors    = require('cors'),
      pool    = require('./db');

const app = express();

const PORT = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//create a todo
app.post('/todos', async (req, res) => {
    try {
        const { content } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo(content) VALUES($1) RETURNING *",
            [content]
        );

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//get all todo
app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message)
    }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getTodo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = $1",       // $1 acts as placeholder/variable
            [id]
        );

        res.json(getTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET content = $1 WHERE todo_id = $2",
            [content, id]
        );

        res.json("Todo was updated");
    } catch (error) {
        console.error(error.message);
    }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
            [id]
        );

        res.json("Todo was deleted!");
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(PORT, () => {
    console.log("Server has started on Port " + PORT);
});