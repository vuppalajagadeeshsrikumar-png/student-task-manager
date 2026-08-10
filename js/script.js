const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();
    const date = taskDate.value;

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span>
            ${taskText}
            ${date ? `<small> — Due: ${date}</small>` : ""}
        </span>

        <button class="complete-btn">✅</button>
        <button class="delete-btn">🗑️</button>
    `;

    taskList.appendChild(li);

    taskInput.value = "";
    taskDate.value = "";

    const completeBtn = li.querySelector(".complete-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    completeBtn.addEventListener("click", function () {
        li.classList.toggle("completed");
    });

    deleteBtn.addEventListener("click", function () {
        li.remove();
    });
});
