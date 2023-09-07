const addTaskButton = document.getElementById('add-task-button');
const taskForm = document.getElementById('task-form');
const addTaskModal = document.getElementById('add-task-modal');
const closeModalButton = document.getElementById('close-modal-button');
const toggleModeButton = document.getElementById('toggle-mode-button');
const body = document.body;

// Task data array to store tasks
const taskData = [];

// Function to toggle between light and dark modes
function toggleMode() {
    body.classList.toggle('dark-mode');
    // Store the current mode in local storage (optional)
    const currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('app-mode', currentMode);
}

// Event listener for mode toggle button
toggleModeButton.addEventListener('click', toggleMode);

// Check the user's previously selected mode from local storage (optional)
const savedMode = localStorage.getItem('app-mode');
if (savedMode === 'dark') {
    body.classList.add('dark-mode');
}

// Function to create a new task card
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('draggable', 'true');
    taskCard.dataset.taskId = task.id;
    taskCard.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <button class="edit-task-button" data-task-id="${task.id}">Edit</button>
        <button class="delete-task-button" data-task-id="${task.id}">Delete</button>
    `;

    // Event listener for task card drag start
    taskCard.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    });

    return taskCard;
}

// Function to add tasks to the Kanban columns
function renderTasks() {
    const todoColumn = document.getElementById('todo-column');
    const doingColumn = document.getElementById('doing-column');
    const doneColumn = document.getElementById('done-column');

    todoColumn.innerHTML = '';
    doingColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    taskData.forEach((task) => {
        const taskCard = createTaskCard(task);

        switch (task.status) {
            case 'todo':
                todoColumn.appendChild(taskCard);
                break;
            case 'doing':
                doingColumn.appendChild(taskCard);
                break;
            case 'done':
                doneColumn.appendChild(taskCard);
                break;
        }
    });
}

// Call the function to initially render tasks
renderTasks();

// Function to generate a unique task ID
function generateTaskId() {
    // Implement your logic to generate a unique task ID
    // For simplicity, you can use a timestamp-based ID
    return 'task-' + Date.now();
}

// Event listener for editing a task
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-task-button')) {
        const taskId = event.target.dataset.taskId;
        const task = taskData.find((t) => t.id === taskId);
        if (task) {
            // Open an edit modal or form and pre-fill it with task data
            // Implement the edit functionality here
            // ...
        }
    }
});

// Event listener for deleting a task
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-task-button')) {
        const taskId = event.target.dataset.taskId;
        const taskIndex = taskData.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
            // Remove the task from the taskData array
            taskData.splice(taskIndex, 1);
            // Re-render tasks to reflect the deletion
            renderTasks();
        }
    }
});

// Event listener for dropping a task into a column
document.addEventListener('drop', (event) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const targetColumn = event.target.closest('.kanban-column');
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);

    if (targetColumn && taskCard) {
        const status = targetColumn.id.replace('-column', ''); // Extract the status from column ID
        const task = taskData.find((t) => t.id === taskId);

        if (task) {
            // Update the task's status
            task.status = status;
            // Re-render tasks to reflect the new status
            renderTasks();
        }
    }
});

// Prevent the default behavior of dropping elements
document.addEventListener('dragover', (event) => {
    event.preventDefault();
});

// Event listener for opening the Add Task modal
addTaskButton.addEventListener('click', () => {
    addTaskModal.style.display = 'block';
});

// Event listener for closing the Add Task modal
closeModalButton.addEventListener('click', () => {
    addTaskModal.style.display = 'none';
    taskForm.reset();
});

// Event listener for adding a new task
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');

    // Get the values entered by the user
    const taskTitle = taskTitleInput.value;
    const taskDescription = taskDescriptionInput.value;

    // Create a new task object
    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        status: 'todo', // Assuming the default status is 'todo'
    };

    // Add the new task to the taskData array
    taskData.push(newTask);

    // Re-render tasks to reflect the addition of the new task
    renderTasks();

    // Close the modal
    addTaskModal.style.display = 'none';

    // Reset the form
    taskForm.reset();
});


// Event listener for editing a task
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-task-button')) {
        const taskId = event.target.dataset.taskId;
        const task = taskData.find((t) => t.id === taskId);

        if (task) {
            // Open the edit modal
            openEditModal(task);
        }
    }
});

// Function to open the edit modal with task data
function openEditModal(task) {
    const editTaskModal = document.getElementById('edit-task-modal');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskDescriptionInput = document.getElementById('edit-task-description');

    // Fill the form with task data
    editTaskTitleInput.value = task.title;
    editTaskDescriptionInput.value = task.description;

    // Show the modal
    editTaskModal.style.display = 'block';

    // Event listener for updating the task
    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Update the task data
        task.title = editTaskTitleInput.value;
        task.description = editTaskDescriptionInput.value;

        // Re-render tasks to reflect the changes
        renderTasks();

        // Close the edit modal
        editTaskModal.style.display = 'none';
    });

    // Event listener for closing the edit modal
    const editModalCloseButton = document.getElementById('edit-modal-close-button');
    editModalCloseButton.addEventListener('click', () => {
        editTaskModal.style.display = 'none';
    });
}

// Function to add tasks to the Kanban columns
function renderTasks() {
    const todoColumn = document.getElementById('todo-column');
    const doingColumn = document.getElementById('doing-column');
    const doneColumn = document.getElementById('done-column');

    todoColumn.innerHTML = '';
    doingColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    taskData.forEach((task) => {
        const taskCard = createTaskCard(task);

        switch (task.status) {
            case 'todo':
                todoColumn.appendChild(taskCard);
                break;
            case 'doing':
                doingColumn.appendChild(taskCard);
                break;
            case 'done':
                doneColumn.appendChild(taskCard);
                break;
            default:
                // Handle any other status or errors as needed
                break;
        }
    });
}

