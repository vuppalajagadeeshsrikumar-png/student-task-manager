const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>
                ${task.text}
                ${task.date ? `<small> — Due: ${task.date}</small>` : ""}
            </span>

            <button class="complete-btn">✅</button>
            <button class="delete-btn">🗑️</button>
        `;

        const completeBtn = li.querySelector(".complete-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        completeBtn.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();
    const date = taskDate.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: taskText,
        date: date,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskDate.value = "";
});

// Display saved tasks when page opens
displayTasks();
