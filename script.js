document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    li.textContent = taskInput.value;
    li.addEventListener("click", toggleTask);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteTask);

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
}

function toggleTask(event) {
    event.target.classList.toggle("completed");
    saveTasks();
}

function deleteTask(event) {
    event.stopPropagation();
    event.target.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((task) => {
        tasks.push({
            text: task.textContent.replace("X", "").trim(),
            completed: task.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((taskData) => {
        const li = document.createElement("li");
        li.textContent = taskData.text;
        if (taskData.completed) {
            li.classList.add("completed");
        }
        li.addEventListener("click", toggleTask);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", deleteTask);

        li.appendChild(deleteBtn);
        document.getElementById("taskList").appendChild(li);
    });
}
