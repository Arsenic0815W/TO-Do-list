document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateTaskCounter();
});

// Add Enter key support
document.getElementById("taskInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", toggleTask);
    
    const taskText = document.createElement("span");
    taskText.textContent = taskInput.value;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteTask);

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    taskList.appendChild(li);

    saveTasks();
    updateTaskCounter();
    taskInput.value = "";
}

function toggleTask(event) {
    const li = event.target.closest('li');
    if (event.target.type === 'checkbox') {
        li.classList.toggle("completed", event.target.checked);
    }
    saveTasks();
    updateTaskCounter();
}

function deleteTask(event) {
    event.stopPropagation();
    event.target.closest('li').remove();
    saveTasks();
    updateTaskCounter();
}

function filterTasks(filter) {
    const tasks = document.querySelectorAll("#taskList li");
    const filterBtns = document.querySelectorAll(".filter-btn");
    
    filterBtns.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[onclick="filterTasks('${filter}')"]`).classList.add("active");

    tasks.forEach(task => {
        switch(filter) {
            case 'all':
                task.style.display = '';
                break;
            case 'active':
                task.style.display = task.classList.contains('completed') ? 'none' : '';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? '' : 'none';
                break;
        }
    });
}

function clearCompleted() {
    const completedTasks = document.querySelectorAll("#taskList li.completed");
    completedTasks.forEach(task => task.remove());
    saveTasks();
    updateTaskCounter();
}

function updateTaskCounter() {
    const totalTasks = document.querySelectorAll("#taskList li").length;
    const completedTasks = document.querySelectorAll("#taskList li.completed").length;
    const counter = document.getElementById("tasks-counter");
    counter.textContent = `${completedTasks}/${totalTasks} completed`;
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((task) => {
        tasks.push({
            text: task.querySelector('span').textContent,
            completed: task.classList.contains("completed"),
            checked: task.querySelector('.task-checkbox').checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';
    
    savedTasks.forEach((taskData) => {
        const li = document.createElement("li");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = taskData.checked;
        checkbox.addEventListener("change", toggleTask);

        if (taskData.completed) {
            li.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.textContent = taskData.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", deleteTask);

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
}