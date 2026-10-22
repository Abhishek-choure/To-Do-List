# TaskFlow — To-Do List App

A modern, responsive task management web application built using HTML, CSS, and vanilla JavaScript. TaskFlow helps users organize daily tasks, track their progress, and manage completed and pending work through a clean dashboard interface.

## 🚀 Features

- **Add Tasks:** Create new tasks with input validation.
- **View Tasks:** Display tasks dynamically in the task list.
- **Edit Tasks:** Update existing task titles.
- **Delete Tasks:** Remove tasks with a confirmation dialog.
- **Mark as Complete:** Toggle tasks between active and completed.
- **Search Tasks:** Find tasks by searching their titles.
- **Filter Tasks:** View All, Active, or Completed tasks.
- **Task Statistics:** Track total, active, and completed tasks.
- **Progress Tracking:** View completion progress as a percentage.
- **Local Storage:** Save and retrieve tasks across browser sessions.
- **Responsive Design:** Works on desktop, tablet, and mobile screens.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- DOM Manipulation
- Event Handling
- Browser Local Storage

## 📁 Project Structure

```text
TodoListApp/
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code (recommended)
- Live Server extension (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd TodoListApp
   ```

3. Open the folder in Visual Studio Code.

4. Open `index.html` in your browser or use the Live Server extension.

No additional dependencies or build tools are required.

## 💡 How to Use

1. Enter a task in the input field and click **Add Task**.
2. Use the checkbox to mark a task as completed or active.
3. Click the edit icon to update a task.
4. Click the delete icon to remove a task after confirmation.
5. Use the search bar to find specific tasks.
6. Select **All**, **Active**, or **Completed** to filter the list.
7. Monitor task counts and completion progress on the dashboard.
8. Refresh the page to verify that tasks are saved in browser storage.

## 💾 Data Persistence

TaskFlow uses the browser's `localStorage` API to save task information as JSON.

Each task contains:

- `id` — Unique task identifier
- `title` — Task description
- `completed` — Task completion status
- `createdAt` — Task creation date and time

**Note:** Tasks are stored locally in the browser. They are not synchronized across different browsers or devices.

## 🧠 Key Learning Outcomes

This project demonstrates practical knowledge of:

- CRUD operations (Create, Read, Update, Delete)
- JavaScript arrays and objects
- DOM creation and manipulation
- Event listeners and event delegation
- Array methods such as `filter()`, `find()`, and `forEach()`
- JSON serialization and parsing
- Browser storage using `localStorage`
- Responsive web design and CSS media queries
- Form validation and dialog handling

## 🔮 Future Improvements

- Add task priorities and due dates.
- Implement task categories and tags.
- Add dark mode.
- Support task sorting.
- Introduce user authentication and cloud synchronization.

## 👨‍💻 Author

**Abhishek Choure**

B.Tech CSE Graduate | Java Full Stack Developer

GitHub: [Add your GitHub profile URL here](https://github.com/)

## 📄 License

This project is available for educational and portfolio purposes. You may add an MIT License if you wish to allow reuse and modification under its terms.
