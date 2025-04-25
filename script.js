document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateTaskCounter();
});

document.getElementById("taskInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const prioritySelect = document.getElementById("prioritySelect");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", toggleTask);
    
    const priorityTag = document.createElement("span");
    priorityTag.classList.add("priority-tag", prioritySelect.value);
    priorityTag.textContent = prioritySelect.value[0].toUpperCase() + prioritySelect.value.slice(1);
    
    const taskText = document.createElement("span");
    taskText.textContent = taskInput.value;
    taskText.classList.add("task-text");
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteTask);

    li.appendChild(checkbox);
    li.appendChild(priorityTag);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    li.dataset.priority = prioritySelect.value;
    
    taskList.appendChild(li);

    saveTasks();
    updateTaskCounter();
    taskInput.value = "";
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((task) => {
        tasks.push({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains("completed"),
            checked: task.querySelector('.task-checkbox').checked,
            priority: task.dataset.priority
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

        const priorityTag = document.createElement("span");
        priorityTag.classList.add("priority-tag", taskData.priority);
        priorityTag.textContent = taskData.priority[0].toUpperCase() + taskData.priority.slice(1);

        const taskText = document.createElement("span");
        taskText.textContent = taskData.text;
        taskText.classList.add("task-text");

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", deleteTask);

        li.appendChild(checkbox);
        li.appendChild(priorityTag);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        li.dataset.priority = taskData.priority;

        if (taskData.completed) {
            li.classList.add("completed");
        }
        
        taskList.appendChild(li);
    });
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