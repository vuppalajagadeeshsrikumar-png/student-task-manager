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

const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}


// ==============================
// UPDATE STATISTICS
// ==============================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}


// ==============================
// DISPLAY TASKS
// ==============================
function getDeadlineStatus(date) {

    if (!date) {
        return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(date + "T00:00:00");
    deadline.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil(
            (deadline - today) / (1000 * 60 * 60 * 24)
        );

    if (difference < 0) {
        return `<span class="deadline-overdue">🔴 Overdue</span>`;
    }

    if (difference === 0) {
        return `<span class="deadline-today">🟠 Due Today</span>`;
    }

    if (difference === 1) {
        return `<span class="deadline-soon">🟡 Due Tomorrow</span>`;
    }

    if (difference <= 7) {
        return `<span class="deadline-soon">🟡 Due in ${difference} days</span>`;
    }

    return `<span class="deadline-upcoming">🟢 Due ${date}</span>`;
}

function displayTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const status = statusFilter.value;
    const subject = subjectFilter.value;
    const priority = priorityFilter.value;


    tasks.forEach(function(task, index) {

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


        // Hide task if it doesn't match filters
        if (
            !matchesSearch ||
            !matchesStatus ||
            !matchesSubject ||
            !matchesPriority
        ) {
            return;
        }


        // Create task element
        const li = document.createElement("li");


        // Completed task styling
        if (task.completed) {
            li.classList.add("completed");
        }


        // Priority styling
        let priorityClass = "";

        if (task.priority === "High") {

            priorityClass = "priority-high";

        } else if (task.priority === "Medium") {

            priorityClass = "priority-medium";

        } else {

            priorityClass = "priority-low";
        }


        // Task HTML
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

                   ${task.completed ? "✅ Completed" : getDeadlineStatus(task.date)}

                </div>

            </div>


            <div>

                <button class="complete-btn">
                    ${task.completed ? "↩️" : "✅"}
                </button>

                <button class="edit-btn">
                    ✏️
                </button>

                <button class="delete-btn">
                    🗑️
                </button>

            </div>
        `;


        // Get buttons
        const completeBtn =
            li.querySelector(".complete-btn");

        const editBtn =
            li.querySelector(".edit-btn");

        const deleteBtn =
            li.querySelector(".delete-btn");


        // ==============================
        // COMPLETE TASK
        // ==============================

        completeBtn.addEventListener("click", function() {

            tasks[index].completed =
                !tasks[index].completed;

            saveTasks();

            displayTasks();
        });


        // ==============================
        // EDIT TASK
        // ==============================

        editBtn.addEventListener("click", function() {

            const editModal =
                document.getElementById("editModal");

            const editTaskInput =
                document.getElementById("editTaskInput");

            const editSubjectInput =
                document.getElementById("editSubjectInput");

            const editPriorityInput =
                document.getElementById("editPriorityInput");

            const editDateInput =
                document.getElementById("editDateInput");


            // Put current task information into popup
            editTaskInput.value =
                task.text;

            editSubjectInput.value =
                task.subject || "";

            editPriorityInput.value =
                task.priority || "Medium";

            editDateInput.value =
                task.date || "";


            // Show popup
            editModal.style.display = "flex";


            const saveEditBtn =
                document.getElementById("saveEditBtn");

            const cancelEditBtn =
                document.getElementById("cancelEditBtn");


            // SAVE EDIT
            saveEditBtn.onclick = function() {

                const updatedText =
                    editTaskInput.value.trim();


                if (updatedText === "") {

                    alert("Task name cannot be empty!");

                    return;
                }


                tasks[index].text =
                    updatedText;

                tasks[index].subject =
                    editSubjectInput.value;

                tasks[index].priority =
                    editPriorityInput.value;

                tasks[index].date =
                    editDateInput.value;


                saveTasks();


                // Close popup
                editModal.style.display = "none";


                // Refresh task list
                displayTasks();
            };


            // CANCEL EDIT
            cancelEditBtn.onclick = function() {

                editModal.style.display = "none";
            };

        });


        // ==============================
        // DELETE TASK
        // ==============================

        deleteBtn.addEventListener("click", function() {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();
        });


        // Add task to page
        taskList.appendChild(li);

    });


    // Update statistics
    updateStats();
}


// ==============================
// ADD TASK
// ==============================

addTaskBtn.addEventListener("click", function() {

    const taskText =
        taskInput.value.trim();

    const subject =
        subjectInput.value;

    const priority =
        priorityInput.value;

    const date =
        taskDate.value;


    // Check task name
    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }


    // Create task
    const newTask = {

        text: taskText,

        subject: subject,

        priority: priority,

        date: date,

        completed: false

    };


    // Add task
    tasks.push(newTask);


    // Save
    saveTasks();


    // Display
    displayTasks();


    // Clear inputs
    taskInput.value = "";

    subjectInput.value = "";

    priorityInput.value = "Medium";

    taskDate.value = "";

});


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener(
    "input",
    displayTasks
);


// ==============================
// STATUS FILTER
// ==============================

statusFilter.addEventListener(
    "change",
    displayTasks
);


// ==============================
// SUBJECT FILTER
// ==============================

subjectFilter.addEventListener(
    "change",
    displayTasks
);


// ==============================
// PRIORITY FILTER
// ==============================

priorityFilter.addEventListener(
    "change",
    displayTasks
);


// ==============================
// DARK MODE
// ==============================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent =
        "☀️ Light Mode";
}


themeToggle.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeToggle.textContent =
                "☀️ Light Mode";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeToggle.textContent =
                "🌙 Dark Mode";

            localStorage.setItem(
                "theme",
                "light"
            );
        }

    }
);


// ==============================
// START APP
// ==============================

displayTasks();