import { useState } from "react";
export default function Todo(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTodoValue, setNewTodoValue] = useState(props.todo.todo);

    const updateTodo = async (todoId, updates) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify(updates),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await res.json();
        console.log("Updated Response:", json); // Debugging


        if (json.modifiedCount > 0) {
            props.setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if (currentTodo._id === todoId) {
                        return { ...currentTodo, ...updates };
                    }
                    return currentTodo;
                });
            });
        }
    }

    const deleteTodo = async (todoId) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "DELETE"
        });
        const json = await res.json();
        
        if (json.acknowledged) {
            props.setTodos(currentTodos => {
                return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
            });
        }
    }

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        updateTodo(props.todo._id, { 
            todo: newTodoValue, 
            status: props.todo.status // Preserve status during update
        });
        setIsEditing(false);
    }

    return (
        <div className="todo">
            {isEditing ? (
                <input 
                    type="text" 
                    value={newTodoValue} 
                    onChange={(e) => setNewTodoValue(e.target.value)}
                />
            ) : (
                <p>{props.todo.todo}</p>
            )}

            <div className="mutations">
                <button
                    className="todo__status"
                    onClick={() => updateTodo(props.todo._id, { status: !props.todo.status })}
                >
                    {(props.todo.status) ? "☑" : "☐"}
                </button>
                {isEditing ? (
                    <button className="todo__save" onClick={handleSave}>💾</button>
                ) : (
                    <button className="todo__edit" onClick={handleEdit}>✏️</button>
                )}
                <button
                    className="todo__delete"
                    onClick={() => deleteTodo(props.todo._id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}