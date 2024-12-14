const express = require("express");
const router = express.Router();
const { getCollection } = require("./models/index");
const { ObjectId } = require("mongodb");
// GET /todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    todo = JSON.stringify(todo);
  
    const newTodo = await collection.insertOne({ todo, status: false });
  
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
})

router.post('/newtask', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
  
    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json(deletedTodo);
  })

// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status, todo } = req.body;

    const updates = {};
    if (typeof status === "boolean") updates.status = status;
    if (typeof todo === "string" && todo.trim() !== "") updates.todo = todo;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ mssg: "No valid fields to update" });
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: updates });
    res.status(200).json(updatedTodo);
});





module.exports = router;