import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch("/api/todos");
      const todos = await res.json();

      setTodos(todos);
    };

    getTodos();
  }, [])

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),  
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

			setContent("");
      setTodos([...todos, newTodo])
    }
  };

  return (
    <main className="container">
     <h1 className="title">My To Do List</h1>
      <h2>Use these links to test with Postman:</h2>
      <ul >
        <li>
          <a href="api/todos" className="view-tasks-btn">
            Get all tasks
          </a>
        </li>
        <li>
          <a href="api/todos" className="view-tasks-btn">
            Post a task
          </a>
        </li>
        <li>
          <a href="api/todos/:id" className="view-tasks-btn">
            Update a task
          </a>
        </li>
        <li>
          <a href="api/todos/:id" className="view-tasks-btn">
            Delete a task
          </a>
        </li>
      </ul>

      <form className="form" onSubmit={createNewTodo}>
        <input 
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Enter task description"
          className="form__input"
          required 
        />
        <button className="submit-btn" type="submit">Create Task</button>
      </form>

      <div className="todos">
        {(todos.length > 0) &&
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))
        }
      </div>
    </main>
  );
}