import { animateScroll } from "./animations/animateScroll.js";
import { fadeInOutText } from "./animations/fadeCommands.js";
import { loadStyles } from "./styleLoader.js";
import UserList from "./classes/UserList.js";
import Task from "./classes/Task.js"; // Import the updated Task class
import { timerAudioEl } from "./Timer.js";

/** @typedef {import("./classes/User").default} User */

/**
 * @class App
 * @property {UserList} userList - The user list
 * @property {Object} goal - The goal configuration
 * @method render - Render the task list to the DOM
 * @method chatHandler - Handles chat commands and responses
 */
export default class App {
	#timerIntervalId = null;

	/**
	 * @constructor
	 * @param {string} storeName - The store name
	 */
	constructor(storeName) {
		this.userList = new UserList(storeName);
		loadStyles(_styles);

		// Initialize goal
		this.goal = {
			value: 0,
			autoSet: true
		};

		// Bind UI event listeners
		this.bindUIEvents();
	}

	/**
	 * Bind event listeners for UI elements like task form and goal settings
	 */
	bindUIEvents() {
		// Task Form Submission
		const taskForm = document.getElementById('task-form');
		taskForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const taskName = document.getElementById('task-name').value.trim();
			const taskValue = parseFloat(document.getElementById('task-value').value);
			if (taskName && taskValue > 0) {
				try {
					const newTask = new Task(taskName, taskValue);
					// Assign tasks to a default user or a specific user as needed
					const user = this.userList.getUser("default") || this.userList.createUser("default", { userColor: "#FFFFFF" });
					this.userList.addUserTask(user.username, newTask.description, newTask.value);
					this.addTaskToDOM(user, newTask);
					this.updateGoal();
					this.updateProgress();
					// Clear form inputs
					document.getElementById('task-name').value = '';
					document.getElementById('task-value').value = '';
				} catch (error) {
					console.error("Error adding task:", error);
				}
			}
		});

		// Goal Settings Toggle
		const autoSetGoalCheckbox = document.getElementById('auto-set-goal');
		autoSetGoalCheckbox.addEventListener('change', (e) => {
			this.goal.autoSet = e.target.checked;
			const manualGoalContainer = document.getElementById('manual-goal');
			if (this.goal.autoSet) {
				manualGoalContainer.style.display = 'none';
				this.updateGoal();
			} else {
				manualGoalContainer.style.display = 'block';
			}
		});

		// Manual Goal Input
		const manualGoalInput = document.getElementById('goal-value');
		manualGoalInput.addEventListener('input', (e) => {
			if (!this.goal.autoSet) {
				const manualGoal = parseFloat(e.target.value);
				if (!isNaN(manualGoal) && manualGoal > 0) {
					this.goal.value = manualGoal;
					this.updateProgress();
				}
			}
		});
	}

	/**
	 * Initial render the components to the DOM. Should only be called once.
	 * @returns {void}
	 */
	render() {
		this.renderTaskList();
		this.renderTaskHeader();
		this.renderProgress();
	}

	/**
	 * Render the task list to the DOM
	 * @returns {void}
	 */
	renderTaskList() {
		if (this.userList.users.length === 0) {
			return;
		}
		const fragment = document.createDocumentFragment();
		this.userList.getAllUsers().forEach((user) => {
			const cardEl = createUserCard(user);
			const list = cardEl.querySelector("ol");
			user.tasks.forEach((task) => {
				const listItem = document.createElement("li");
				listItem.classList.add("task");
				listItem.dataset.taskId = `${task.id}`;
				listItem.innerText = `${task.description} (${task.value})`; // Display task value
				if (task.isComplete()) {
					listItem.classList.add("done");
				}
				list.appendChild(listItem);
			});
			fragment.appendChild(cardEl);
		});
		const primaryClone = fragment.cloneNode(true);
		const primaryContainer = document.querySelector(".task-container.primary");
		primaryContainer.innerHTML = "";
		primaryContainer.appendChild(primaryClone);

		const secondaryClone = fragment.cloneNode(true);
		const secondaryContainer = document.querySelector(".task-container.secondary");
		secondaryContainer.innerHTML = "";
		secondaryContainer.appendChild(secondaryClone);

		animateScroll();
	}

	/**
	 * Render the task header to the DOM
	 * @returns {void}
	 */
	renderTaskHeader() {
		this.renderTaskCount();
		const { headerFeature, headerCustomText } = _settings;
		if (headerFeature.toLowerCase() === "timer") {
			this.renderTimer();
		} else if (headerFeature.toLowerCase() === "commands") {
			this.renderCommandTips();
		} else if (headerFeature.toLowerCase() === "text") {
			this.renderCustomText(headerCustomText);
		}
	}

	/**
	 * Render the task count and update progress
	 * @returns {void}
	 */
	renderTaskCount() {
		this.updateProgress();
	}

	/**
	 * Render Pomodoro timer to the DOM
	 * @returns {void}
	 */
	renderTimer() {
		const timerEl = document.querySelector(".timer");
		timerEl.classList.remove("hidden");
	}

	/**
	 * Start a focus session timer
	 * @param {number} FocusDuration - The duration of the timer in minutes
	 * @param {number} breakDuration - The duration of the timer in minutes
	 * @return {void}
	 */
	startTimer(FocusDuration = 0, breakDuration = 10) {
		this.#timerIntervalId && clearInterval(this.#timerIntervalId);
		const timerEl = document.querySelector(".timer");
		/** @type {HTMLElement} */
		const timerTitleEl = timerEl.querySelector(".timer-title");
		const timerElement = timerEl.querySelector(".timer-countdown");
		let timer = FocusDuration * 60;
		fadeInOutText(timerTitleEl, "Focus");
		let firstPass = true;
		const updateTimer = () => {
			const minutes = Math.floor(timer / 60)
				.toString()
				.padStart(2, "0");
			const seconds = (timer % 60).toString().padStart(2, "0");
			timerElement.textContent = `${minutes}:${seconds}`;
			if (timer === 0) {
				clearInterval(this.#timerIntervalId);
				fadeInOutText(timerTitleEl, "Break");
				timerElement.textContent = "00:00";
				timerAudioEl.play();
				timer = breakDuration * 60;
				if (firstPass) {
					this.#timerIntervalId = setInterval(updateTimer, 1000);
					firstPass = false;
				}
			} else {
				timer--;
			}
		};
		this.#timerIntervalId = setInterval(updateTimer, 1000);
	}

	/**
	 * Render command tips to the DOM
	 * @returns {void}
	 */
	renderCommandTips() {
		const tips = ["!task", "!edit", "!done", "!delete", "!check", "!help"];
		const commandTipEl = document.querySelector(".command-tips");
		commandTipEl.classList.remove("hidden");
		let tipIdx = 0;
		setInterval(() => {
			/** @type {HTMLElement} */
			const commandCodeEl = commandTipEl.querySelector(".command-code");
			fadeInOutText(commandCodeEl, tips[tipIdx]);
			tipIdx = (tipIdx + 1) % tips.length;
		}, 6000);
	}

	/**
	 * Render custom text to the DOM
	 * @param {string} text - The custom text to display
	 * @returns {void}
	 */
	renderCustomText(text) {
		document.querySelector(".custom-header").classList.remove("hidden");
		document.querySelector(".custom-text").textContent = text;
	}

	/**
	 * Handles chat commands and responses
	 * @param {string} username
	 * @param {string} command
	 * @param {string} message
	 * @param {{broadcaster: boolean, mod: boolean}} flags
	 * @param {{userColor: string, messageId?: string}} extra
	 * @returns {{error: boolean, message: string}} - Response message
	 */
	chatHandler(username, command, message, flags, extra) {
		command = `!${command.toLowerCase()}`;
		const { languageCode, maxTasksPerUser, headerFeature } = _settings;	

		let template = "";
		let responseDetail = "";

		try {
			// ADMIN COMMANDS
			if (isMod(flags)) {
				if (
					headerFeature.toLowerCase() === "timer" &&
					_adminConfig.commands.timer.includes(command) &&
					flags.broadcaster
				) {
					const [focusTime, breakTime] = message.split("/");
					const focusDuration = parseInt(focusTime, 10);
					const breakDuration = parseInt(breakTime, 10) || 10;
					if (
						isNaN(focusDuration) ||
						focusDuration < 0 ||
						isNaN(breakDuration) ||
						breakDuration < 0
					) {
						throw new Error("Invalid timer duration");
					}
					this.startTimer(focusDuration, breakDuration);
					template = _adminConfig.responseTo[languageCode].timer;
					responseDetail = focusTime;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearList.includes(command)) {
					this.userList.clearUserList();
					this.clearListFromDOM();
					template = _adminConfig.responseTo[languageCode].clearList;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearDone.includes(command)) {
					const tasks = this.userList.clearDoneTasks();
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					template = _adminConfig.responseTo[languageCode].clearDone;
					return respondMessage(template, username, responseDetail);
				} else if (_adminConfig.commands.clearUser.includes(command)) {
					const user = this.userList.deleteUser(message);
					this.deleteUserFromDOM(user);
					responseDetail = user.username;
					template = _adminConfig.responseTo[languageCode].clearUser;
					return respondMessage(template, username, responseDetail);
				}
			}

			// USER COMMANDS
			if (_userConfig.commands.addTask.includes(command)) {
				// ADD TASK
				if (message === "") {
					throw new Error("Task description is empty");
				}

				// Parse tasks with values, assuming format "task1:10, task2:20"
				const taskDescriptions = message.split(",").map(taskStr => {
					const [desc, val] = taskStr.split(":").map(s => s.trim());
					if (!desc || isNaN(parseFloat(val)) || parseFloat(val) <= 0) {
						throw new Error(`Invalid task format: "${taskStr}". Use "description:value".`);
					}
					return { description: desc, value: parseFloat(val) };
				});

				const user =
					this.userList.getUser(username) ||
					this.userList.createUser(username, {
						userColor: extra.userColor,
					});

				if (
					user.getTasks().length + taskDescriptions.length >
					parseInt(maxTasksPerUser.toString(), 10)
				) {
					template = _userConfig.responseTo[languageCode].maxTasksAdded;
				} else {
					const tasks = this.userList.addUserTasks(
						username,
						taskDescriptions
					);
					tasks.forEach((task) => {
						this.addTaskToDOM(user, task);
					});
					responseDetail = taskDescriptions.map(t => `${t.description}:${t.value}`).join(", ");
					template = _userConfig.responseTo[languageCode].addTask;
				}
			} else if (_userConfig.commands.editTask.includes(command)) {
				// EDIT TASK
				const whiteSpaceIdx = message.search(/(?<=\d)\s/); // number followed by space
				if (whiteSpaceIdx === -1) {
					throw new Error(
						"Task number or description format is invalid"
					);
				}
				const taskNumber = message.slice(0, whiteSpaceIdx);
				const newDescription = message.slice(whiteSpaceIdx + 1);
				const task = this.userList.editUserTask(
					username,
					parseTaskIndex(taskNumber),
					newDescription
				);
				this.editTaskFromDOM(task);
				responseDetail = taskNumber;
				template = _userConfig.responseTo[languageCode].editTask;
			} else if (_userConfig.commands.finishTask.includes(command)) {
				// COMPLETE/DONE TASK
				const indices = message.split(",").reduce((acc, i) => {
					if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
					return acc;
				}, []);
				const tasks = this.userList.completeUserTasks(
					username,
					indices
				);
				tasks.forEach(({ id }) => {
					this.completeTaskFromDOM(id);
				});
				if (tasks.length === 0) {
					template =
						_userConfig.responseTo[languageCode].noTaskFound;
				} else {
					responseDetail = tasks.reduce((acc, task, i, list) => {
						let taskDesc =
							i === list.length - 1
								? task.description
								: i === list.length - 2
								? `${task.description}, & `
								: `${task.description}, `;
						acc = acc.concat(taskDesc);
						return acc;
					}, "");

					template = _userConfig.responseTo[languageCode].finishTask;
				}
			} else if (_userConfig.commands.deleteTask.includes(command)) {
				// DELETE/REMOVE TASK
				responseDetail = message;
				if (message.toLowerCase() === "all") {
					const user = this.userList.deleteUser(username);
					this.deleteUserFromDOM(user);
					template = _userConfig.responseTo[languageCode].deleteAll;
				} else {
					const indices = message.split(",").reduce((acc, i) => {
						if (parseTaskIndex(i) >= 0) acc.push(parseTaskIndex(i));
						return acc;
					}, []);
					const tasks = this.userList.deleteUserTasks(
						username,
						indices
					);
					tasks.forEach(({ id }) => {
						this.deleteTaskFromDOM(id);
					});
					if (tasks.length === 0) {
						template =
							_userConfig.responseTo[languageCode].noTaskFound;
					} else {
						template =
							_userConfig.responseTo[languageCode].deleteTask;
					}
				}
			} else if (_userConfig.commands.check.includes(command)) {
				// CHECK TASKS
				const taskMap = this.userList.checkUserTasks(username);
				const list = [];
				for (let [taskNumber, task] of taskMap) {
					list.push(`${taskNumber + 1}. ${task.description} (${task.value})`);
				}
				responseDetail = list.join(" | ");
				if (responseDetail === "") {
					template = _userConfig.responseTo[languageCode].noTaskFound;
				} else {
					template = _userConfig.responseTo[languageCode].check;
				}
			} else if (_userConfig.commands.help.includes(command)) {
				// HELP COMMAND
				template = _userConfig.responseTo[languageCode].help;
			} else if (_userConfig.commands.additional.includes(command)) {
				// ADDITIONAL COMMANDS
				template = _userConfig.responseTo[languageCode].additional;
			} else {
				// INVALID COMMAND
				throw new Error("command not found");
			}

			return respondMessage(template, username, responseDetail);
		} catch (error) {
			return respondMessage(
				_userConfig.responseTo[languageCode].invalidCommand,
				username,
				error.message,
				true
			);
		}
	}

	/**
	 * Render the progress bar
	 * @returns {void}
	 */
	renderProgress() {
		const progressContainer = document.getElementById('progress-container');
		const progressBar = document.getElementById('progress-bar');
		const progressText = document.getElementById('progress-text');
		// Initially set to 0
		progressBar.style.width = '0%';
		progressText.textContent = '0%';
	}

	/**
	 * Update the progress based on completed task values
	 * @returns {void}
	 */
	updateProgress() {
		const completedTasks = this.userList.getAllUsers().flatMap(user =>
			user.tasks.filter(task => task.isComplete())
		);
		const totalCompletedValue = completedTasks.reduce((sum, task) => sum + task.value, 0);
		const totalTaskValue = this.goal.autoSet ? 
			this.userList.getAllUsers().flatMap(user => user.tasks).reduce((sum, task) => sum + task.value, 0) : 
			this.goal.value;
		const progressPercent = totalTaskValue > 0 ? Math.min((totalCompletedValue / totalTaskValue) * 100, 100) : 0;
		const progressBar = document.getElementById('progress-bar');
		const progressText = document.getElementById('progress-text');

		progressBar.style.width = `${progressPercent}%`;
		progressText.textContent = `${progressPercent.toFixed(2)}%`;

		// Change color if goal met
		if (totalCompletedValue >= totalTaskValue && totalTaskValue > 0) {
			progressBar.classList.add('completed');
		} else {
			progressBar.classList.remove('completed');
		}

		// Update task count display
		const taskCountSpan = document.querySelector('.task-count');
		taskCountSpan.innerText = `${totalCompletedValue}/${totalTaskValue}`;
	}

	/**
	 * Add the task to the DOM
	 * @param {User} user
	 * @param {Task} task
	 * @returns {void}
	 */
	addTaskToDOM(user, task) {
		const primaryContainer = document.querySelector(".task-container.primary");
		const secondaryContainer = document.querySelector(".task-container.secondary");
		const userCardEls = document.querySelectorAll(
			`[data-user="${user.username}"]`
		);
		if (userCardEls.length === 0) {
			const userCard = createUserCard(user);
			const clonedUserCard = userCard.cloneNode(true);
			primaryContainer.appendChild(userCard);
			secondaryContainer.appendChild(clonedUserCard);
		}
		const taskElement = document.createElement("li");
		taskElement.classList.add("task");
		taskElement.dataset.taskId = `${task.id}`;
		taskElement.innerText = `${task.description} (${task.value})`; // Display task value
		const cloneTaskElement = taskElement.cloneNode(true);

		primaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			.appendChild(taskElement);
		secondaryContainer
			.querySelector(`[data-user="${user.username}"] .tasks`)
			.appendChild(cloneTaskElement);

		this.renderTaskCount();
		this.updateProgress();
		animateScroll();
	}

	/**
	 * Edit the task description in the DOM
	 * @param {Task} task
	 * @returns {void}
	 */
	editTaskFromDOM(task) {
		/** @type {NodeListOf<HTMLElement>} */
		const taskElements = document.querySelectorAll(
			`[data-task-id="${task.id}"]`
		);
		for (const taskElement of taskElements) {
			taskElement.innerText = `${task.description} (${task.value})`;
		}
		this.updateProgress();
	}

	/**
	 * Complete the task in the DOM
	 * @param {string} taskId
	 * @returns {void}
	 */
	completeTaskFromDOM(taskId) {
		const taskElements = document.querySelectorAll(
			`[data-task-id="${taskId}"]`
		);
		for (const taskElement of taskElements) {
			taskElement.classList.add("done");
		}
		this.updateProgress();
	}

	/**
	 * Delete the task in the DOM
	 * @param {string} taskId
	 * @returns {void}
	 */
	deleteTaskFromDOM(taskId) {
		const taskElements = document.querySelectorAll(
			`[data-task-id="${taskId}"]`
		);
		for (const taskElement of taskElements) {
			if (taskElement.parentElement.children.length === 1) {
				// remove the user card if there is only one task
				taskElement.parentElement.parentElement.remove();
			} else {
				taskElement.remove();
			}
		}
		this.updateProgress();
	}

	/**
	 * Delete the user in the DOM
	 * @param {User} user
	 * @returns {void}
	 */
	deleteUserFromDOM(user) {
		// remove user card and reduce total tasks count
		const { username, tasks } = user;
		const userCardEls = document.querySelectorAll(
			`[data-user="${username}"]`
		);
		for (let card of userCardEls) {
			card.remove();
		}
		this.updateProgress();
	}

	/**
	 * Clear all tasks from the DOM
	 * @returns {void}
	 */
	clearListFromDOM() {
		const primaryContainer = document.querySelector(".task-container.primary");
		const secondaryContainer = document.querySelector(".task-container.secondary");
		primaryContainer.innerHTML = "";
		secondaryContainer.innerHTML = "";
		this.updateProgress();
	}
}

/**
 * Responds with a formatted message
 * @param {string} template - The response template
 * @param {string} username - The username of the user
 * @param {string} message - The message to replace in the template
 * @param {boolean} error - If the response is an error
 * @returns {{message: string, error: boolean}}
 */
function respondMessage(template, username, message, error = false) {
	const response = {
		message: template
			.replace("{user}", username)
			.replace("{message}", message),
		error,
	};
	return response;
}

/**
 * Check if the user is a mod or broadcaster
 * @param {{broadcaster: boolean, mod: boolean}} flags
 * @returns {boolean}
 */
function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

/**
 * Parse the task index
 * @param {string} index
 * @returns {number}
 */
function parseTaskIndex(index) {
	return parseInt(index, 10) - 1;
}

/**
 * Create a user card element
 * @param {{username: string, userColor: string, tasks: Task[]}} user
 * @returns {HTMLDivElement}
 */
function createUserCard({ username, userColor, tasks }) {
	const cardEl = document.createElement("div");
	cardEl.classList.add("card");
	cardEl.dataset.user = username;
	const userNameDiv = document.createElement("div");
	userNameDiv.classList.add("username");
	userNameDiv.innerText = username;
	userNameDiv.style.color = _settings.showUsernameColor
		? userColor
		: "";
	cardEl.appendChild(userNameDiv);
	const list = document.createElement("ol");
	list.classList.add("tasks");
	cardEl.appendChild(list);
	return cardEl;
}
