const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

function saveTasks() {
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  renderTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    status: 'todo'
  };

  tasks.push(newTask);
  taskInput.value = '';
  saveTasks();
}

function moveTask(id, newStatus) {
  tasks = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function renderTasks() {
  const todoList = document.getElementById('todoList');
  const progressList = document.getElementById('progressList');
  const doneList = document.getElementById('doneList');

  todoList.innerHTML = '';
  progressList.innerHTML = '';
  doneList.innerHTML = '';

  let counts = { todo: 0, progress: 0, done: 0 };

  tasks.forEach(task => {
    counts[task.status]++;
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        ${task.status !== 'todo' ? `<button onclick="moveTask(${task.id}, 'todo')"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
        ${task.status === 'todo' ? `<button onclick="moveTask(${task.id}, 'progress')"><i class="fa-solid fa-arrow-right"></i></button>` : ''}
        ${task.status === 'progress' ? `<button onclick="moveTask(${task.id}, 'done')"><i class="fa-solid fa-check"></i></button>` : ''}
        <button class="btn-delete" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    if (task.status === 'todo') todoList.appendChild(card);
    if (task.status === 'progress') progressList.appendChild(card);
    if (task.status === 'done') doneList.appendChild(card);
  });

  document.getElementById('todoCount').textContent = counts.todo;
  document.getElementById('progressCount').textContent = counts.progress;
  document.getElementById('doneCount').textContent = counts.done;
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

renderTasks();
