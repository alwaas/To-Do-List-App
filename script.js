document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

// Add Task
document.getElementById("addBtn").addEventListener("click", addTask);

// Dark Mode
document.getElementById("themeToggle").addEventListener("click", toggleTheme);

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (text === "") return;

    createTask(text);
    saveTask(text);

    input.value = "";
}

function createTask(text, completed = false) {
    const ul = document.getElementById("taskList");

    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = text;

    taskText.addEventListener("click", () => {
        li.classList.toggle("completed");
        updateTaskStatus(text, li.classList.contains("completed"));
    });

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";

    editBtn.addEventListener("click", () => {
        const newText = prompt("Edit Task:", text);
        if (newText && newText.trim()) {
            updateTaskText(text, newText);
            taskText.textContent = newText;
            text = newText;
        }
    });

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";

    delBtn.addEventListener("click", () => {
        li.remove();
        deleteTask(text);
    });

    const btnContainer = document.createElement("div");
    btnContainer.className = "btns";
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);

    li.appendChild(taskText);
    li.appendChild(btnContainer);
    ul.appendChild(li);
}

// LocalStorage Functions
function saveTask(text) {
    const tasks = getTasks();
    tasks.push({ text, completed: false });
    localStorage.setItem("todo", JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("todo")) || [];
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(t => createTask(t.text, t.completed));
}

function deleteTask(text) {
    const tasks = getTasks().filter(t => t.text !== text);
    localStorage.setItem("todo", JSON.stringify(tasks));
}

function updateTaskStatus(text, completed) {
    const tasks = getTasks().map(t => t.text === text ? { ...t, completed } : t);
    localStorage.setItem("todo", JSON.stringify(tasks));
}

function updateTaskText(oldText, newText) {
    const tasks = getTasks().map(t => t.text === oldText ? { ...t, text: newText } : t);
    localStorage.setItem("todo", JSON.stringify(tasks));
}
