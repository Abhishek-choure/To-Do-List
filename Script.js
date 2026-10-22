
"use strict";

// =====================================
// 1. DOM Elements
// =====================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyDescription = document.getElementById("empty-description");
const formMessage = document.getElementById("form-message");

const editDialog = document.getElementById("edit-dialog");
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-input");

const deleteDialog = document.getElementById("delete-dialog");
const deleteForm = document.getElementById("delete-form");

const toast = document.getElementById("toast");

// =====================================
// 2. Application State
// =====================================

const STORAGE_KEY = "taskflow_tasks";

let tasks = loadTasks();
let currentFilter = "all";
let editingTaskId = null;
let deletingTaskId = null;
let toastTimer = null;

// =====================================
// 3. Local Storage
// =====================================

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        // Validate stored data before using it.
        return parsedTasks.filter((task) => {
            return (
                task !== null &&
                typeof task === "object" &&
                typeof task.id === "string" &&
                typeof task.title === "string" &&
                typeof task.completed === "boolean" &&
                typeof task.createdAt === "string"
            );
        });
    } catch (error) {
        console.error("Unable to load tasks:", error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Unable to save tasks:", error);
        showToast("Unable to save changes in this browser.");
        return false;
    }
}

// =====================================
// 4. Utility Functions
// =====================================

function createId() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function updateCurrentDate() {
    document.getElementById("current-date").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
}

// =====================================
// 5. Add a New Task
// =====================================

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title.length === 0) {
        formMessage.textContent = "Please enter a task title.";
        taskInput.focus();
        return;
    }

    if (title.length > 150) {
        formMessage.textContent =
            "Task title cannot exceed 150 characters.";
        return;
    }

    const newTask = {
        id: createId(),
        title: title,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    const saved = saveTasks();

    renderTasks();

    taskInput.value = "";
    formMessage.textContent = "";
    taskInput.focus();

    showToast(saved ? "Task added successfully!" : "Task added for this session.");
});

// Clear validation feedback while typing.
taskInput.addEventListener("input", function () {
    formMessage.textContent = "";
});

// =====================================
// 6. Get Filtered Tasks
// =====================================

function getFilteredTasks() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    return tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchTerm);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        } else if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });
}

// =====================================
// 7. Render Tasks
// =====================================

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach((task) => {
        const taskItem = document.createElement("article");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("is-completed");
        }

        // Completion checkbox
        const checkbox = document.createElement("button");
        checkbox.type = "button";
        checkbox.className = "task-checkbox";
        checkbox.dataset.action = "toggle";
        checkbox.dataset.id = task.id;
        checkbox.setAttribute(
            "aria-label",
            task.completed
                ? "Mark task as active"
                : "Mark task as completed"
        );

        if (task.completed) {
            checkbox.classList.add("checked");
            checkbox.textContent = "✓";
        }

        // Task details
        const details = document.createElement("div");
        details.className = "task-details";

        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const date = document.createElement("span");
        date.textContent = "Created " + formatDate(task.createdAt);

        const status = document.createElement("span");
        status.className = "task-status";

        if (task.completed) {
            status.classList.add("completed");
            status.textContent = "Completed";
        } else {
            status.textContent = "In Progress";
        }

        meta.append(date, status);
        details.append(title, meta);

        // Edit and Delete buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "icon-button";
        editButton.dataset.action = "edit";
        editButton.dataset.id = task.id;
        editButton.textContent = "✎";
        editButton.setAttribute("aria-label", "Edit " + task.title);
        editButton.title = "Edit task";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "icon-button delete-button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = task.id;
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete " + task.title);
        deleteButton.title = "Delete task";

        actions.append(editButton, deleteButton);

        taskItem.append(checkbox, details, actions);
        taskList.appendChild(taskItem);
    });

    updateStatistics();
    updateEmptyState(filteredTasks.length);
}

// =====================================
// 8. Update Task Statistics
// =====================================

function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(
        (task) => task.completed
    ).length;
    const active = total - completed;

    document.getElementById("total-count").textContent = total;
    document.getElementById("active-count").textContent = active;
    document.getElementById("completed-count").textContent = completed;

    document.getElementById("sidebar-all").textContent = total;
    document.getElementById("sidebar-active").textContent = active;
    document.getElementById("sidebar-completed").textContent = completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progress-percent").textContent =
        percentage + "%";

    document.getElementById("progress-fill").style.width =
        percentage + "%";

    const progressTrack = document.getElementById("progress-track");
    progressTrack.setAttribute("aria-valuenow", percentage);

    const visibleTotal = getFilteredTasks().length;

    document.getElementById("visible-count").textContent =
        visibleTotal + (visibleTotal === 1 ? " task" : " tasks");
}

// =====================================
// 9. Empty State
// =====================================

function updateEmptyState(visibleTotal) {
    if (visibleTotal > 0) {
        emptyState.hidden = true;
        return;
    }

    emptyState.hidden = false;

    if (tasks.length === 0) {
        emptyTitle.textContent = "Your workspace is clear!";
        emptyDescription.textContent =
            "Add your first task above and start making progress.";
    } else if (searchInput.value.trim() !== "") {
        emptyTitle.textContent = "No matching tasks";
        emptyDescription.textContent =
            "Try another search term to find your tasks.";
    } else if (currentFilter === "active") {
        emptyTitle.textContent = "No active tasks";
        emptyDescription.textContent =
            "All tasks are completed, or add a new one.";
    } else {
        emptyTitle.textContent = "No completed tasks yet";
        emptyDescription.textContent =
            "Complete a task and it will appear here.";
    }
}

// =====================================
// 10. Search Tasks
// =====================================

searchInput.addEventListener("input", function () {
    renderTasks();
});

// =====================================
// 11. Filter Tasks
// =====================================

function setFilter(filter) {
    currentFilter = filter;

    // Update filter buttons in both the sidebar and toolbar.
    document.querySelectorAll("[data-filter]").forEach((button) => {
        const isActive = button.dataset.filter === filter;

        button.classList.toggle("active", isActive);

        if (button.classList.contains("filter-button")) {
            button.setAttribute("aria-pressed", String(isActive));
        }
    });

    const subtitles = {
        all: "Manage everything in one place.",
        active: "Focus on the tasks still in progress.",
        completed: "Review the tasks you have finished."
    };

    document.getElementById("list-subtitle").textContent =
        subtitles[filter];

    renderTasks();
}

document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", function () {
        setFilter(button.dataset.filter);
    });
});

// =====================================
// 12. Toggle Task Completion
// =====================================

function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    const saved = saveTasks();

    renderTasks();

    if (task.completed) {
        showToast(
            saved
                ? "Great job! Task completed."
                : "Task completed for this session."
        );
    } else {
        showToast(
            saved
                ? "Task marked as active."
                : "Task updated for this session."
        );
    }
}

// =====================================
// 13. Edit Task
// =====================================

function openEditDialog(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        return;
    }

    editingTaskId = id;
    editInput.value = task.title;

    editDialog.showModal();
    editInput.focus();
    editInput.select();
}

function closeEditDialog() {
    editingTaskId = null;

    if (editDialog.open) {
        editDialog.close();
    }
}

editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = editInput.value.trim();

    if (!title) {
        editInput.focus();
        return;
    }

    const task = tasks.find(
        (item) => item.id === editingTaskId
    );

    if (!task) {
        closeEditDialog();
        return;
    }

    task.title = title;

    const saved = saveTasks();

    closeEditDialog();
    renderTasks();

    showToast(
        saved
            ? "Task updated successfully!"
            : "Task updated for this session."
    );
});

document.getElementById("close-dialog").addEventListener(
    "click",
    closeEditDialog
);

document.getElementById("cancel-edit").addEventListener(
    "click",
    closeEditDialog
);

// =====================================
// 14. Delete Task
// =====================================

function openDeleteDialog(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        return;
    }

    deletingTaskId = id;
    deleteDialog.showModal();
}

function closeDeleteDialog() {
    deletingTaskId = null;

    if (deleteDialog.open) {
        deleteDialog.close();
    }
}

deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const task = tasks.find(
        (item) => item.id === deletingTaskId
    );

    if (!task) {
        closeDeleteDialog();
        return;
    }

    tasks = tasks.filter(
        (item) => item.id !== deletingTaskId
    );

    const saved = saveTasks();

    closeDeleteDialog();
    renderTasks();

    showToast(
        saved
            ? "Task deleted successfully."
            : "Task deleted for this session."
    );
});

document.getElementById("close-delete-dialog").addEventListener(
    "click",
    closeDeleteDialog
);

document.getElementById("cancel-delete").addEventListener(
    "click",
    closeDeleteDialog
);

// =====================================
// 15. Handle Task Actions
// =====================================

// Event delegation: one listener handles task buttons.
taskList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !taskList.contains(button)) {
        return;
    }

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "toggle") {
        toggleTask(id);
    } else if (action === "edit") {
        openEditDialog(id);
    } else if (action === "delete") {
        openDeleteDialog(id);
    }
});

// =====================================
// 16. Initialize Application
// =====================================

updateCurrentDate();
renderTasks();
