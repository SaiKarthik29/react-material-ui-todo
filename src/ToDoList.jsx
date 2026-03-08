import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

export default function TodoList() {

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    setTodos([
      ...todos,
      { id: uuidv4(), task: newTask, isDone: false }
    ]);

    setNewTask("");
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleDone = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setNewTask(todo.task);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editId ? { ...todo, task: newTask } : todo
      )
    );

    setEditId(null);
    setNewTask("");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.isDone));
  };

  return (
    <Container maxWidth="sm">

      <Paper elevation={4} style={{ padding: 20, marginTop: 40 }}>

        <Typography variant="h4" align="center" gutterBottom>
          React Todo
        </Typography>

        <div style={{ display: "flex", gap: 10 }}>

          <TextField
            label="Add Task"
            variant="outlined"
            fullWidth
            value={newTask}
            onChange={handleChange}
          />

          {editId ? (
            <Button
              variant="contained"
              color="warning"
              onClick={saveEdit}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
            >
              Add
            </Button>
          )}

        </div>

        <List>

          {todos.map((todo) => (

            <ListItem
              key={todo.id}
              secondaryAction={
                <>
                  <IconButton
                    color="success"
                    onClick={() => toggleDone(todo.id)}
                  >
                    <CheckIcon />
                  </IconButton>

                  <IconButton
                    color="primary"
                    onClick={() => startEdit(todo)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => deleteTask(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >

              <ListItemText
                primary={todo.task}
                style={{
                  textDecoration: todo.isDone
                    ? "line-through"
                    : "none"
                }}
              />

            </ListItem>

          ))}

        </List>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={clearCompleted}
        >
          Clear Completed Tasks
        </Button>

      </Paper>

    </Container>
  );
}