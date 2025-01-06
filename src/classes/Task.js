/**
 * @class Task
 * @property {string} description - The description of the task.
 * @property {number} value - The numerical value of the task.
 * @property {string} id - The id of the task.
 * @property {boolean} completionStatus - Indicates whether the task is complete or not.
 * @method validateDescription - Validate the description of the task.
 * @method validateValue - Validate the value of the task.
 * @method setDescription - Set the description of the task.
 * @method setValue - Set the value of the task.
 * @method isComplete - Get the completion status of the task.
 * @method setCompletionStatus - Set the status of the task.
 * @returns {Task}
 */
export default class Task {
	/**
	 * @constructor
	 * @param {string} description - The description of the task.
	 * @param {number} value - The numerical value of the task.
	 */
	constructor(description, value) {
		this.description = this.validateDescription(description);
		this.value = this.validateValue(value);
		this.id = this.#assignId();
		this.completionStatus = false;
	}

	/**
	 * Validate the description of the task.
	 * @param {string} description - The description of the task.
	 * @returns {string} The validated description of the task.
	 * @throws {Error} If the description is invalid.
	 */
	validateDescription(description) {
		if (typeof description !== "string") {
			throw new Error(`Task description must be of type string`);
		}
		description = description.trim();
		if (description.length === 0) {
			throw new Error("Task description cannot be empty");
		}
		return description;
	}

	/**
	 * Validate the value of the task.
	 * @param {number} value - The value of the task.
	 * @returns {number} The validated value of the task.
	 * @throws {Error} If the value is invalid.
	 */
	validateValue(value) {
		if (typeof value !== "number" || isNaN(value)) {
			throw new Error("Task value must be a valid number");
		}
		if (value <= 0) {
			throw new Error("Task value must be greater than zero");
		}
		return value;
	}

	/**
	 * Assign a unique ID to the task based on the current date and a random salt.
	 * @returns {string} The unique ID of the task.
	 */
	#assignId() {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, "0");
		const hour = String(now.getHours()).padStart(2, "0");
		const minute = String(now.getMinutes()).padStart(2, "0");
		const second = String(now.getSeconds()).padStart(2, "0");
		const millisecond = String(now.getMilliseconds()).padStart(3, "0");
		const salt = Math.floor(Math.random() * 10000);
		// Format: DDHHMMSSMS + 4-digit salt
		return `${day}${hour}${minute}${second}${millisecond}${salt}`;
	}

	/**
	 * Set the description of the task.
	 * @param {string} description - The new description of the task.
	 * @returns {void}
	 */
	setDescription(description) {
		this.description = this.validateDescription(description);
	}

	/**
	 * Set the value of the task.
	 * @param {number} value - The new value of the task.
	 * @returns {void}
	 */
	setValue(value) {
		this.value = this.validateValue(value);
	}

	/**
	 * Get the completion status of the task.
	 * @returns {boolean} The completion status of the task.
	 */
	isComplete() {
		return this.completionStatus;
	}

	/**
	 * Set the completion status of the task.
	 * @param {boolean} status - The new completion status of the task.
	 * @returns {void}
	 * @throws {Error} If the status is not a boolean.
	 */
	setCompletionStatus(status) {
		if (typeof status !== "boolean") {
			throw new Error("Completion status must be of type boolean");
		}
		this.completionStatus = status;
	}
}
