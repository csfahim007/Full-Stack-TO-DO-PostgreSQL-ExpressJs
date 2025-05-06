const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");

//middleware
app.use(cors());
app.use(express.json()); 

//Routes

//create a todo
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            " INSERT INTO todoTL (description) VALUES($1) RETURNING *", [description]            
        );
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});

//get all todos
app.get("/todos", async(req,res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todoTL");
        res.json(allTodos.rows);

    } catch (error) {
        console.log(error.message);
    }
})
//get a todo
app.get("/todos/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const s_todo = await pool.query("SELECT * FROM todoTL WHERE  todo_id = $1", [id])
        res.json(s_todo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
})
 

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;

        const updateTodo = await pool.query("UPDATE todoTL SET description = $1 WHERE todo_id = $2 RETURNING*", [description, id]);

        res.json(updateTodo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
})

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const delTodo = await pool.query("DELETE FROM  todoTL WHERE todo_id = $1", [id]);
        res.json("TODO was deleted!");
    } catch (error) {
        console.log(error.message);
    }
});


app.listen(5000, () => { 
    console.log("Server has started on 5000")
}) 