const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const subjectFilter = document.getElementById("subjectFilter");
const priorityFilter = document.getElementById("priorityFilter");

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

    const searchText = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const subject = subjectFilter.value;
    const priority = priorityFilter.value;

    tasks.forEach(function (task, index) {

        // Search filter
        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        // Status filter
        const matchesStatus =
            status === "all" ||
            (status === "active" && !task.completed) ||
            (status === "completed" && task.completed);

        // Subject filter
        const matchesSubject =
            subject === "all" ||
            task.subject === subject;

        // Priority filter
        const matchesPriority =
            priority === "all" ||
            task.priority === priority;

        if (
            !matchesSearch ||
            !matchesStatus ||
            !matchesSubject ||
            !matchesPriority
        ) {
            return;
        }

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

                    📚 ${task.subject || "No subject"}

                    &nbsp; | &nbsp;

                    <span class="${priorityClass}">
                        ${task.priority}
                    </span>

                    ${task.date ? `&nbsp; | &nbsp; 📅 ${task.date}` : ""}

                </div>

            </div>

            <div>
                <button class="complete-btn">✅</button>
                <button class="delete-btn">🗑️</button>
            </div>
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

    tasks.push({
        text: taskText,
        subject: subject,
        priority: priority,
        date: date,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    subjectInput.value = "";
    priorityInput.value = "Medium";
    taskDate.value = "";
});

// Search and filters
searchInput.addEventListener("input", displayTasks);
statusFilter.addEventListener("change", displayTasks);
subjectFilter.addEventListener("change", displayTasks);
priorityFilter.addEventListener("change", displayTasks);

// Display tasks when page loads
displayTasks();