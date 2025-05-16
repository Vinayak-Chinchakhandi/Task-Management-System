// // Clears all data in localStorage
// localStorage.clear();
// alert("All data has been cleared and you can start from scratch!");


// Utility functions
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Validation Functions
function validateSignupForm(user) {
  const nameRegex = /^[a-zA-Z]+$/; // Only letters
  const mobileRegex = /^\d+$/; // Only digits

  if (!nameRegex.test(user.firstName)) {
      alert("First name must contain only letters.");
      return false;
  }
  if (!nameRegex.test(user.lastName)) {
      alert("Last name must contain only letters.");
      return false;
  }
  if (!nameRegex.test(user.username)) {
      alert("Username must contain only letters.");
      return false;
  }
  if (!mobileRegex.test(user.mobile)) {
      alert("Mobile number must contain only digits.");
      return false;
  }

  const users = getData("users");
  if (users.some(u => u.username === user.username)) {
      alert("Username already exists. Please choose another.");
      return false;
  }

  return true;
}

// Validate Task Function
function validateTask(task) {
  // Validate the time part
  const [hour, minute] = task.dueTime.split(":").map(Number);
  if (hour < 0 || hour >= 24 || isNaN(hour)) {
      alert("Hour must be between 0 and 23.");
      return false;
  }
  if (minute < 0 || minute >= 60 || isNaN(minute)) {
      alert("Minutes must be between 0 and 59.");
      return false;
  }

  // Combine the dueDate (yyyy-mm-dd) and dueTime (hh:mm) into a single Date object
  const [year, month, day] = task.dueDate.split('-').map(Number);
  const taskDueDate = new Date(year, month - 1, day, hour, minute, 0, 0); // Create the full Date object

  // Get current date and time
  const currentDate = new Date();

  // Compare the task's due date and time with the current date and time
  if (taskDueDate < currentDate) {
      alert("Due date and time must be in the future.");
      return false;
  }

  return true;
}

// Navigation Functions
function showSignupPage() {
  document.getElementById('welcomePage').classList.add('hidden');
  document.getElementById('signupPage').classList.remove('hidden');
}

function showLoginPage() {
  document.getElementById('welcomePage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
}

function showWelcomePage() {
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('welcomePage').classList.remove('hidden');
}

function showAppPage() {
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('welcomePage').classList.add('hidden');
  document.getElementById('newTaskPage').classList.add('hidden');
  document.getElementById('taskDetailsPage').classList.add('hidden');
  document.getElementById('completedTasksPage').classList.add('hidden'); // Hide completed tasks page
  document.getElementById('canceledTasksPage').classList.add('hidden'); // Hide canceled tasks page
  document.getElementById('appPage').classList.remove('hidden');
  document.getElementById('sidebar').classList.add('hidden'); // Sidebar is hidden by default
  displayTasks(); // Refresh tasks list
}
function showNewTaskPage() {
  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('newTaskPage').classList.remove('hidden');
}

function logout() {
  alert('You have been logged out!');
  location.reload();
}

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

function showCompletedTasksPage() {
  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('completedTasksPage').classList.remove('hidden');
  displayCompletedTasks(); // Load completed tasks
}

function showCanceledTasksPage() {
  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('canceledTasksPage').classList.remove('hidden');
  displayCanceledTasks(); // Load canceled tasks
}

// Signup Logic
document.getElementById("signupForm").onsubmit = function (event) {
  event.preventDefault();
  const user = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      mobile: document.getElementById("mobileNumber").value,
      username: document.getElementById("usernameSignup").value,
      password: document.getElementById("passwordSignup").value,
  };

  if (validateSignupForm(user)) {
      const users = getData("users");
      users.push(user);
      setData("users", users);
      alert("Signup successful!");
      showWelcomePage();
  }
};

// Login Logic
document.getElementById("loginForm").onsubmit = function (event) {
  event.preventDefault();
  const username = document.getElementById("usernameLogin").value;
  const password = document.getElementById("passwordLogin").value;

  const users = getData("users");
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
      alert("Login successful!");
      showAppPage();
  } else {
      alert("Invalid login credentials!");
  }
};

// Task Management Logic
// Task Management Logic
document.getElementById('newTaskForm').onsubmit = function (event) {
  event.preventDefault();
  
  // Create task object
  const task = {
    name: document.getElementById('taskName').value,
    description: document.getElementById('taskDescription').value,
    dueDate: document.getElementById('dueDate').value, // "yyyy-mm-dd" format
    dueTime: document.getElementById('dueTime').value, // "hh:mm" format
    progress: 'Not Started',
  };

  // Validate the task before saving
  if (!validateTask(task)) {
    return; // Prevent task from being added if validation fails
  }

  const tasks = getData('tasks');
  tasks.push(task);
  setData('tasks', tasks);

  alert('Task added!');
  showAppPage();
};

// Display Tasks
function displayTasks() {
  const tasks = getData('tasks');
  const tasksContainer = document.getElementById('tasksContainer');
  tasksContainer.innerHTML = '';

  if (tasks.length === 0) {
    tasksContainer.innerHTML = '<p>No tasks yet. Add some tasks!</p>';
  } else {
    tasks.forEach((task, index) => {
      const taskButton = document.createElement('button');
      taskButton.textContent = `${index + 1}. ${task.name}`;
      taskButton.className = 'task-button';
      taskButton.onclick = () => displayTaskDetails(index);
      tasksContainer.appendChild(taskButton);
    });
  }
}

let currentTaskIndex = null;

// Display Task Details
function displayTaskDetails(index) {
  const tasks = getData('tasks');
  const task = tasks[index];

  document.getElementById('taskNameDetails').textContent = task.name;
  document.getElementById('taskDescriptionDetails').textContent = task.description;
  document.getElementById('dueDateDetails').textContent = task.dueDate;
  document.getElementById('dueTimeDetails').textContent = task.dueTime;
  document.getElementById('progressDetails').textContent = task.progress;

  currentTaskIndex = index;

  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('taskDetailsPage').classList.remove('hidden');
}

// Update Task Progress
function updateProgress() {
  const tasks = getData('tasks');
  const newProgress = prompt('Enter new progress status (e.g., In Progress, Completed, etc.):');
  
  if (newProgress) {
    tasks[currentTaskIndex].progress = newProgress;
    setData('tasks', tasks); // Update the tasks in localStorage

    alert('Task progress updated!');
    displayTaskDetails(currentTaskIndex); // Refresh task details page
  }
}

// Mark Task as Completed
function markAsCompleted() {
  const tasks = getData('tasks');
  const completedTasks = getData('completedTasks') || [];

  completedTasks.push(tasks[currentTaskIndex]);
  tasks.splice(currentTaskIndex, 1);

  setData('tasks', tasks);
  setData('completedTasks', completedTasks);

  alert('Task marked as completed!');
  showAppPage();
}

// Delete Task
function deleteTask() {
  const tasks = getData('tasks');
  const canceledTasks = getData('canceledTasks') || [];

  if (confirm('Are you sure you want to delete this task?')) {
    canceledTasks.push(tasks[currentTaskIndex]);
    tasks.splice(currentTaskIndex, 1);

    setData('tasks', tasks);
    setData('canceledTasks', canceledTasks);

    alert('Task deleted!');
    showAppPage();
  }
}

// Show Completed Tasks
function showCompletedTasks() {
  const completedTasks = getData('completedTasks');
  const container = document.getElementById('completedTasksContainer');
  container.innerHTML = '';

  if (completedTasks.length === 0) {
    container.innerHTML = '<p>No completed tasks yet.</p>';
  } else {
    completedTasks.forEach((task, index) => {
      const taskElement = document.createElement('div');
      taskElement.textContent = `${index + 1}. ${task.name} - ${task.dueDate} ${task.dueTime}`;
      container.appendChild(taskElement);
    });
  }

  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('completedTasksPage').classList.remove('hidden');
}

// Show Canceled Tasks
function showCancelledTasks() {
  const canceledTasks = getData('canceledTasks');
  const container = document.getElementById('canceledTasksContainer');
  container.innerHTML = '';

  if (canceledTasks.length === 0) {
    container.innerHTML = '<p>No canceled tasks yet.</p>';
  } else {
    canceledTasks.forEach((task, index) => {
      const taskElement = document.createElement('div');
      taskElement.textContent = `${index + 1}. ${task.name} - ${task.dueDate} ${task.dueTime}`;
      container.appendChild(taskElement);
    });
  }

  document.getElementById('appPage').classList.add('hidden');
  document.getElementById('canceledTasksPage').classList.remove('hidden');
}

// Logout
function logout() {
  alert('You have been logged out!');
  location.reload();
}

