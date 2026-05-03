// =========================
// FULLSTACK TODO APP
// Backend: Node.js + Express + SQLite
// Frontend: Vanilla HTML + JS
// =========================

// ===== 1. INSTALL DEPENDENCIES =====
// npm init -y
// npm install express sqlite3 cors

// ===== 2. BACKEND (server.js) =====

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./todos.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    task TEXT,
    is_done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// GET todos by date
app.get('/todos', (req, res) => {
  const { year, month, day } = req.query;
  db.all(
    `SELECT * FROM todos WHERE year=? AND month=? AND day=? ORDER BY id DESC`,
    [year, month, day],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// ADD todo
app.post('/todos', (req, res) => {
  const { year, month, day, task } = req.body;
  db.run(
    `INSERT INTO todos (year, month, day, task) VALUES (?, ?, ?, ?)`,
    [year, month, day, task],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// TOGGLE DONE
app.put('/todos/:id', (req, res) => {
  const { is_done } = req.body;
  db.run(
    `UPDATE todos SET is_done=? WHERE id=?`,
    [is_done, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  db.run(`DELETE FROM todos WHERE id=?`, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));


// ===== 3. FRONTEND (public/index.html) =====

/*
Buat folder bernama "public", lalu isi file index.html:
*/

/*
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
  <style>
    body { font-family: Arial; max-width: 500px; margin: auto; }
    li { display: flex; justify-content: space-between; }
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
  const date = new Date(document.getElementById('datePicker').value);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
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
        <button onclick="remove(${todo.id})">❌</button>
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

async function remove(id) {
  await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

// default hari ini
const today = new Date().toISOString().split('T')[0];
document.getElementById('datePicker').value = today;

document.getElementById('datePicker').addEventListener('change', loadTodos);

loadTodos();
</script>

</body>
</html>
*/


// ===== 4. CARA JALANKAN =====
// node server.js
// buka http://localhost:3000


// ===== 5. DEPLOY =====
// Gunakan Railway / Render
// Pastikan tambahkan:
// - package.json start script: "start": "node server.js"

// SELESAI 🚀
