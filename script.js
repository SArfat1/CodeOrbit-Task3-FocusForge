/*
=========================================
CodeOrbit To-Do List
Smart Task Manager
=========================================
*/


/* =========================================
   GET HTML ELEMENTS
========================================= */

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const priorityInput =
    document.getElementById("priorityInput");

const categoryInput =
    document.getElementById("categoryInput");

const dueDateInput =
    document.getElementById("dueDateInput");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const emptyState =
    document.getElementById("emptyState");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const progressFill =
    document.getElementById("progressFill");

const progressPercentage =
    document.getElementById("progressPercentage");

const themeBtn =
    document.getElementById("themeBtn");

const toast =
    document.getElementById("toast");


/* =========================================
   EDIT MODAL ELEMENTS
========================================= */

const editModal =
    document.getElementById("editModal");

const editTaskInput =
    document.getElementById("editTaskInput");

const editPriorityInput =
    document.getElementById("editPriorityInput");

const editCategoryInput =
    document.getElementById("editCategoryInput");

const editDueDateInput =
    document.getElementById("editDueDateInput");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const saveEditBtn =
    document.getElementById("saveEditBtn");


let editingTaskId = null;


/* =========================================
   LOAD DATA
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("codeOrbitTodoTasks")
    ) || [];


let currentFilter = "all";


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "codeOrbitTodoTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD TASK
========================================= */

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        showToast(
            "Please enter a task."
        );

        taskInput.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false,

        priority:
            priorityInput.value,

        category:
            categoryInput.value,

        dueDate:
            dueDateInput.value

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    taskInput.value = "";

    dueDateInput.value = "";

    priorityInput.value = "medium";

    categoryInput.value = "personal";


    taskInput.focus();


    showToast(
        "Task added successfully! ✓"
    );

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredTasks =
        tasks.filter(function(task) {

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchText);


            let matchesFilter = true;


            if (
                currentFilter === "active"
            ) {

                matchesFilter =
                    !task.completed;

            }


            if (
                currentFilter === "completed"
            ) {

                matchesFilter =
                    task.completed;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    /* EMPTY STATE */

    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    /* CREATE TASKS */

    filteredTasks.forEach(
        function(task) {

            const li =
                document.createElement("li");


            li.className =
                "task-item";


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            /* CHECKBOX */

            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";

            checkbox.className =
                "task-checkbox";

            checkbox.checked =
                task.completed;


            checkbox.addEventListener(
                "change",
                function() {

                    toggleTask(
                        task.id
                    );

                }
            );


            /* CONTENT */

            const content =
                document.createElement(
                    "div"
                );

            content.className =
                "task-content";


            /* TASK TITLE */

            const title =
                document.createElement(
                    "span"
                );

            title.className =
                "task-title";

            title.textContent =
                task.text;


            /* TASK DETAILS */

            const details =
                document.createElement(
                    "div"
                );

            details.className =
                "task-details";


            /* PRIORITY */

            const priority =
                document.createElement(
                    "span"
                );

            priority.className =
                `badge priority-${task.priority}`;


            const priorityNames = {

                low: "🟢 Low",

                medium: "🟡 Medium",

                high: "🔴 High"

            };


            priority.textContent =
                priorityNames[
                    task.priority
                ] || "🟡 Medium";


            /* CATEGORY */

            const category =
                document.createElement(
                    "span"
                );

            category.className =
                "badge category-badge";


            const categoryNames = {

                personal: "🏠 Personal",

                study: "📚 Study",

                work: "💼 Work",

                project: "💻 Project",

                shopping: "🛒 Shopping"

            };


            category.textContent =
                categoryNames[
                    task.category
                ] || "🏠 Personal";


            /* DUE DATE */

            if (task.dueDate) {

                const date =
                    document.createElement(
                        "span"
                    );

                date.className =
                    "badge date-badge";

                date.textContent =
                    `📅 ${formatDate(
                        task.dueDate
                    )}`;

                details.appendChild(
                    date
                );

            }


            details.appendChild(
                priority
            );

            details.appendChild(
                category
            );


            content.appendChild(
                title
            );

            content.appendChild(
                details
            );


            /* ACTIONS */

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "task-actions";


            /* EDIT BUTTON */

            const editBtn =
                document.createElement(
                    "button"
                );

            editBtn.className =
                "action-btn edit-btn";

            editBtn.textContent =
                "✏️";

            editBtn.title =
                "Edit task";


            editBtn.addEventListener(
                "click",
                function() {

                    editTask(
                        task.id
                    );

                }
            );


            /* DELETE BUTTON */

            const deleteBtn =
                document.createElement(
                    "button"
                );

            deleteBtn.className =
                "action-btn delete-btn";

            deleteBtn.textContent =
                "🗑️";

            deleteBtn.title =
                "Delete task";


            deleteBtn.addEventListener(
                "click",
                function() {

                    deleteTask(
                        task.id
                    );

                }
            );


            actions.appendChild(
                editBtn
            );

            actions.appendChild(
                deleteBtn
            );


            /* BUILD TASK */

            li.appendChild(
                checkbox
            );

            li.appendChild(
                content
            );

            li.appendChild(
                actions
            );


            taskList.appendChild(
                li
            );

        }
    );


    updateStatistics();

}


/* =========================================
   TOGGLE COMPLETE
========================================= */

function toggleTask(taskId) {

    tasks =
        tasks.map(
            function(task) {

                if (
                    task.id === taskId
                ) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }

                return task;

            }
        );


    saveTasks();

    renderTasks();


    showToast(
        "Task status updated ✓"
    );

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(taskId) {

    const task =
        tasks.find(
            function(item) {

                return (
                    item.id === taskId
                );

            }
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    editTaskInput.value =
        task.text;


    editPriorityInput.value =
        task.priority || "medium";


    editCategoryInput.value =
        task.category || "personal";


    editDueDateInput.value =
        task.dueDate || "";


    editModal.classList.add(
        "show"
    );


    setTimeout(
        function() {

            editTaskInput.focus();

        },
        200
    );

}


/* =========================================
   SAVE EDITED TASK
========================================= */

function saveEditedTask() {

    const newText =
        editTaskInput.value.trim();


    if (newText === "") {

        showToast(
            "Task cannot be empty."
        );

        editTaskInput.focus();

        return;

    }


    const task =
        tasks.find(
            function(item) {

                return (
                    item.id === editingTaskId
                );

            }
        );


    if (!task) {

        closeEditModal();

        return;

    }


    task.text =
        newText;


    task.priority =
        editPriorityInput.value;


    task.category =
        editCategoryInput.value;


    task.dueDate =
        editDueDateInput.value;


    saveTasks();

    renderTasks();

    closeEditModal();


    showToast(
        "Task updated successfully ✏️"
    );

}


/* =========================================
   CLOSE EDIT MODAL
========================================= */

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingTaskId = null;

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function(task) {

                return (
                    task.id !== taskId
                );

            }
        );


    saveTasks();

    renderTasks();


    showToast(
        "Task deleted 🗑️"
    );

}


/* =========================================
   CLEAR COMPLETED TASKS
========================================= */

function clearCompletedTasks() {

    const completedCount =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    if (completedCount === 0) {

        showToast(
            "No completed tasks to clear."
        );

        return;

    }


    const confirmed =
        confirm(
            `Clear ${completedCount} completed task(s)?`
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function(task) {

                return !task.completed;

            }
        );


    saveTasks();

    renderTasks();


    showToast(
        "Completed tasks cleared ✓"
    );

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    progressPercentage.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    function() {

        renderTasks();

    }
);


/* =========================================
   FILTERS
========================================= */

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =========================================
   ADD BUTTON
========================================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);


/* =========================================
   ENTER KEY
========================================= */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


/* =========================================
   CLEAR COMPLETED
========================================= */

clearCompletedBtn.addEventListener(
    "click",
    clearCompletedTasks
);


/* =========================================
   EDIT MODAL EVENTS
========================================= */

saveEditBtn.addEventListener(
    "click",
    saveEditedTask
);


closeModalBtn.addEventListener(
    "click",
    closeEditModal
);


cancelEditBtn.addEventListener(
    "click",
    closeEditModal
);


/* CLICK OUTSIDE MODAL */

editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


/* ENTER TO SAVE EDIT */

editTaskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            saveEditedTask();

        }

    }
);


/* ESCAPE TO CLOSE */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains("show")
        ) {

            closeEditModal();

        }

    }
);


/* =========================================
   DARK MODE
========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "codeOrbitTodoTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";

    } else {

        themeBtn.textContent =
            "🌙";

    }

}


themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        if (isDark) {

            localStorage.setItem(
                "codeOrbitTodoTheme",
                "dark"
            );

            themeBtn.textContent =
                "☀️";

        } else {

            localStorage.setItem(
                "codeOrbitTodoTheme",
                "light"
            );

            themeBtn.textContent =
                "🌙";

        }

    }
);


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================
   INITIALIZE
========================================= */

loadTheme();

renderTasks();