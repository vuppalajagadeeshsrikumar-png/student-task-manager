const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        let priorityClass = "";

        if (task.priority === "High") {
            priorityClass = "priority-high";
        } else if (task.priority === "Medium") {
            priorityClass = "priority-medium";
        } else {
            priorityClass = "priority-low";
        }

        li.innerHTML = `
            <div class="task-info">

                <div class="task-name">
                    ${task.text}
                </div>

                <div class="task-details">

                    📚 ${task.subject || "Other"}

                    &nbsp; | &nbsp;

                    <span class="${priorityClass}">
                        ${task.priority}
                    </span>

                    ${task.date ? `&nbsp; | &nbsp; 📅 ${task.date}` : ""}

                </div>

            </div>

            <div>

                <button class="complete-btn">
                    ✅
                </button>

                <button class="delete-btn">
                    🗑️
                </button>

            </div>
        `;

        const completeBtn = li.querySelector(".complete-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        completeBtn.addEventListener("click", function () {

            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            displayTasks();
            updateStats();

        });

        deleteBtn.addEventListener("click", function () {

            tasks.splice(index, 1);

            saveTasks();
            displayTasks();
            updateStats();

        });

        taskList.appendChild(li);
    });

    updateStats();
}

addTaskBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();
    const subject = subjectInput.value;
    const priority = priorityInput.value;
    const date = taskDate.value;

    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }

    const newTask = {

        text: taskText,
        subject: subject,
        priority: priority,
        date: date,
        completed: false

    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
    subjectInput.value = "";
    priorityInput.value = "Medium";
    taskDate.value = "";

});

// Load tasks when page opens
displayTasks();
