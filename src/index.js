const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response
      .status(404)
      .json({ error: "The indicated user does not exist" });
  }

  request.user = user;
  next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const alreadyExistUsername = users.find((user) => user.username === username);

  if (alreadyExistUsername) {
    return response.status(400).json({ error: "Username is not available" });
  }

  if (name && username) {
    const newUser = {
      id: uuidv4(),
      name,
      username,
      todos: [],
    };

    users.push(newUser);

    return response.status(201).json(newUser);
  }

  return response
    .status(400)
    .json({ error: "You must establish a name and a username" });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(user.todos);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const updateTodo = user.todos.find((todo) => todo.id === id);

  if (!updateTodo) {
    return response
      .status(404)
      .json({ error: "The id you passed does not have any related id" });
  }

  updateTodo.title = title;
  updateTodo.deadline = new Date(deadline);

  return response.json(user.todos);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const updateTodo = user.todos.find((todo) => todo.id === id);

  if (!updateTodo) {
    return response
      .status(404)
      .json({ error: "The id you passed does not have any related id" });
  }

  updateTodo.done = true;

  return response.json(user.todos);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const existTodo = user.todos.find((todo) => todo.id === id);

  if (!existTodo) {
    return response
      .status(404)
      .json({ error: "The id you passed does not have any related id" });
  }

  user.todos.splice(existTodo, 1);

  return response.status(204).send();
});

module.exports = app;
