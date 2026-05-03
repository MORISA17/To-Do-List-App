// =============================
// TODO APP (RAILWAY READY)
// Backend + Frontend
// FIXED: using better-sqlite3
// =============================

// INSTALL:
// npm init -y
// npm install express better-sqlite3 cors

// =============================
// server.js
// =============================

const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// DB (Railway safe path)
const db = new Database('/tmp/todos.db');

// create table
 db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    task TEXT,
    is_done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// GET
app.get('/todos', (req, res) => {
  const { year, month, day } = req.query;

  const rows = db
    .prepare('SELECT * FROM todos WHERE year=? AND month=? AND day=? ORDER BY id DESC')
    .all(year, month, day);

  res.json(rows);
});

// POST
app.post('/todos', (req, res) => {
  const { year, month, day, task } = req.body;

  const result = db
    .prepare('INSERT INTO todos (year, month, day, task) VALUES (?, ?, ?, ?)')
    .run(year, month, day, task);

  res.json({ id: result.lastInsertRowid });
});

// TOGGLE
app.put('/todos/:id', (req, res) => {
  const { is_done } = req.body;

  db.prepare('UPDATE todos SET is_done=? WHERE id=?')
    .run(is_done, req.params.id);

  res.json({ success: true });
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id=?')
    .run(req.params.id);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on ' + PORT));


// =============================
// package.json (IMPORTANT)
// =============================

/*
{
  "name": "todo-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.0.0",
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18"
  }
}
*/


// =============================
// public/index.html
// =============================

/*
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
  <style>
    body { font-family: Arial; max-width: 500px; margin: auto; }
    li { display: flex; justify-content: space-between; margin: 5px 0; }
  </style>
</head>
<body>

<h2>Todo List</h2>

<input type="date" id="datePicker" />
<ul id="list"></ul>

<input type="text" id="taskInput" placeholder="Tambah tugas" />
<button onclick="addTodo()">Tambah</button>

<script>
const API = '';

function getDateParts() {
  const d = new Date(document.getElementById('datePicker').value);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate()
  };
}

async function loadTodos() {
  const { year, month, day } = getDateParts();
  const res = await fetch(`${API}/todos?year=${year}&month=${month}&day=${day}`);
  const data = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  data.forEach(todo => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span style="text-decoration:${todo.is_done ? 'line-through' : 'none'}">
        ${todo.task}
      </span>
      <div>
        <button onclick="toggle(${todo.id}, ${todo.is_done})">✔</button>
        <button onclick="removeTodo(${todo.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById('taskInput');
  const { year, month, day } = getDateParts();

  await fetch(`${API}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year, month, day, task: input.value })
  });

  input.value = '';
  loadTodos();
}

async function toggle(id, current) {
  await fetch(`${API}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_done: current ? 0 : 1 })
  });

  loadTodos();
}

async function removeTodo(id) {
  await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

const today = new Date().toISOString().split('T')[0];
document.getElementById('datePicker').value = today;

document.getElementById('datePicker').addEventListener('change', loadTodos);

loadTodos();
</script>

</body>
</html>
*/

// =============================
// DONE ✅
// =============================
