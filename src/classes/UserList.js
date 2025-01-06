import User from "./User.js";
import Task from "./Task.js";

/**
 * @class UserList
 * @property {User[]} users
 * @property {number} tasksCompleted
 * @property {number} totalTasks
 * @method getUser - Get the user by username
 * @method getAllUsers - Get all users
 * @method createUser - Create a new user
 * @method addUserTasks - Add tasks to the specified user
 * @method editUserTask - Edit the task at the specified index
 * @method completeUserTasks - Mark specified tasks as complete
 * @method deleteUserTasks - Delete tasks at specified indices
 * @method checkUserTasks - Get tasks based on completion status
 * @method clearUserList - Clear user list
 * @method clearDoneTasks - Clear all done tasks
 * @method deleteUser - Delete the user
 */
export default class UserList {
	#localStoreName;
	/**
	 * @constructor
	 * @param {string} localStoreName - The name of the local storage
	 * @property {User[]} users - The list of users
	 */
	constructor(localStoreName = "userList") {
		this.#localStoreName = localStoreName;
		this.tasksCompleted = 0;
		this.totalTasks = 0;
		this.users = this.#loadUserListFromLocalStorage();
	}

	/**
	 * Load the user list from local storage
	 * @returns {User[]} The user list
	 */
	#loadUserListFromLocalStorage() {
		const userList = [];
		let lStore = localStorage.getItem(this.#localStoreName);

		if (lStore) {
			JSON.parse(lStore).forEach((lsUser) => {
				const user = new User(lsUser.username, {
					userColor: lsUser.userColor,
				});
				lsUser.tasks.forEach((task) => {
					try {
						const newTask = new Task(task.description, task.value);
						newTask.id = task.id;
						newTask.completionStatus = task.completionStatus;
						user.addTask(newTask);
						this.totalTasks++;
						if (newTask.isComplete()) {
							this.tasksCompleted++;
						}
					} catch (error) {
						console.error(`Error loading task for user ${lsUser.username}:`, error);
					}
				});
				userList.push(user);
			});
		} else {
			localStorage.setItem(this.#localStoreName, JSON.stringify(userList));
		}
		return userList;
	}

	/**
	 * Commit userList changes to local storage
	 * @returns {void}
	 */
	#commitToLocalStorage() {
		const data = this.users.map((user) => ({
			username: user.username,
			userColor: user.userColor,
			tasks: user.getTasks().map((task) => ({
				description: task.description,
				value: task.value,
				id: task.id,
				completionStatus: task.completionStatus,
			})),
		}));
		localStorage.setItem(this.#localStoreName, JSON.stringify(data));
	}

	/**
	 * Get user by username
	 * @param {string} username - The username of the user
	 * @returns {User | undefined} The user
	 */
	getUser(username) {
		return this.users.find((user) => user.username.toLowerCase() === username.toLowerCase());
	}

	/**
	 * Get all users
	 * @returns {User[]} All users
	 */
	getAllUsers() {
		return this.users;
	}

	/**
	 * Create new user
	 * @param {string} username - The username of the user
	 * @param {{userColor: string}} options - The options for the user
	 * @throws {Error} If the user already exists
	 * @returns {User} The newly created User object
	 */
	createUser(username, options) {
		if (this.getUser(username)) {
			throw new Error(`${username} already exists`);
		}
		const user = new User(username, options);
		this.users.push(user);
		this.#commitToLocalStorage();
		return user;
	}

	/**
	 * Add tasks to a user
	 * @param {string} username - The username of the user
	 * @param {Array<{description: string, value: number}>} taskDescriptions - The tasks to add
	 * @throws {Error} If user does not exist
	 * @returns {Task[]} The added tasks
	 */
	addUserTasks(username, taskDescriptions) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} does not exist`);
		}
		const tasks = [];
		taskDescriptions.forEach((taskDesc) => {
			try {
				const newTask = new Task(taskDesc.description, taskDesc.value);
				user.addTask(newTask);
				tasks.push(newTask);
				this.totalTasks++;
			} catch (error) {
				console.error(`Error adding task to user ${username}:`, error);
			}
		});
		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Edit the task at the specified index
	 * @param {string} username - The username of the user
	 * @param {number} taskIndex - The index of the task to edit
	 * @param {string} [taskDescription] - The new task description
	 * @param {number} [taskValue] - The new task value
	 * @throws {Error} User or Index not found
	 * @returns {Task} The edited task
	 */
	editUserTask(username, taskIndex, taskDescription, taskValue) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`${username} has no tasks`);
		}
		const task = user.editTask(taskIndex, taskDescription, taskValue);
		if (!task) {
			throw new Error(`Task ${taskIndex} not found`);
		}
		this.#commitToLocalStorage();
		return task;
	}

	/**
	 * Mark the user tasks as complete
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index or indices of the tasks to complete
	 * @throws {Error} User not found
	 * @returns {Task[]} The completed tasks
	 */
	completeUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		const tasks = [].concat(indices).reduce((acc, curr) => {
			const task = user.getTask(curr);
			if (task && !task.isComplete()) {
				task.setCompletionStatus(true);
				this.tasksCompleted++;
				acc.push(task);
			}
			return acc;
		}, []);
		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Delete the user tasks
	 * @param {string} username - The username of the user
	 * @param {number | number[]} indices - The index or indices of the tasks to delete
	 * @throws {Error} User not found
	 * @returns {Task[]} The deleted tasks
	 */
	deleteUserTasks(username, indices) {
		const user = this.getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		const items = [].concat(indices).filter((i) => {
			return user.validTaskIndex(i);
		});
		const tasksForDeletion = user.deleteTask(items);
		tasksForDeletion.forEach((task) => {
			if (task.isComplete()) {
				this.tasksCompleted--;
			}
			this.totalTasks--;
		});
		if (user.getTasks().length === 0) {
			this.deleteUser(username);
		}
		this.#commitToLocalStorage();
		return tasksForDeletion;
	}

	/**
	 * Check and retrieve tasks based on completion status
	 * @param {string} username - The username of the user
	 * @param {string} status - The completion status ("complete" or "incomplete")
	 * @returns {Map<number, Task>} The tasks specified by status
	 */
	checkUserTasks(username, status = "incomplete") {
		const user = this.getUser(username);
		if (!user) {
			return new Map();
		}
		const map = new Map();
		user.getTasks().forEach((task, i) => {
			if (status === "incomplete" && !task.isComplete()) {
				map.set(i, task);
			}
			if (status === "complete" && task.isComplete()) {
				map.set(i, task);
			}
		});
		return map;
	}

	/**
	 * Clear UserList
	 * @returns {void}
	 */
	clearUserList() {
		this.users = [];
		this.tasksCompleted = 0;
		this.totalTasks = 0;
		this.#commitToLocalStorage();
	}

	/**
	 * Clear all done tasks from all users
	 * @returns {Task[]} The deleted tasks from all users
	 */
	clearDoneTasks() {
		let tasks = [];
		this.users.forEach((user) => {
			let removedTasks = user.removeCompletedTasks();
			removedTasks.forEach((task) => {
				if (task.isComplete()) {
					this.tasksCompleted--;
				}
				this.totalTasks--;
			});
			tasks = tasks.concat(removedTasks);
		});
		this.#commitToLocalStorage();
		return tasks;
	}

	/**
	 * Delete a user by username
	 * @param {string} username - The username of the user to delete
	 * @throws {Error} If the user is not found
	 * @returns {User} The deleted user
	 */
	deleteUser(username) {
		const userIndex = this.users.findIndex(
			(user) => user.username.toLowerCase() === username.toLowerCase()
		);
		if (userIndex === -1) {
			throw new Error(`${username} not found`);
		}
		const user = this.users.splice(userIndex, 1)[0];
		user.getTasks().forEach((task) => {
			if (task.isComplete()) {
				this.tasksCompleted--;
			}
			this.totalTasks--;
		});
		this.#commitToLocalStorage();
		return user;
	}

	/**
	 * Adjust the task count
	 * @param {Task[]} removedTasks - The tasks to remove
	 * @returns {void}
	 */
	decreaseTaskCount(removedTasks) {
		removedTasks.forEach((t) => {
			if (t.isComplete()) {
				this.tasksCompleted--;
			}
			this.totalTasks--;
		});
	}
}
