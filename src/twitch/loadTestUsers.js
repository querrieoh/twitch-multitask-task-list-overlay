/** @typedef {import('./TwitchChat').default} TwitchChat*/

/**
 * Load messages to App List for testing & styling purposes
 * @param {TwitchChat} twitchClient - The TwitchChat instance
 * @returns void
 */
export function loadTestUsers(twitchClient) {
	twitchClient.emit("command", {
		user: "adminUser",
		command: "clearList",
		message: "",
		flags: { broadcaster: true, mod: false },
		extra: {
			userColor: "#FF0000",
			messageId: `${generateTimeStamp()}`,
		},
	});

	const colorOptions = [
		"red",
		"coral",
		"springGreen",
		"lightSeaGreen",
		"slateBlue",
		"hotpink",
		"violet",
		"orange",
		"darkTurquoise",
		"dodgerblue",
		"blueviolet",
	];
	const { maxTasksPerUser } = _settings;
	for (let i = 1; i <= 8; i++) {
		const userName = `Username${i}`;
		const userColor = colorOptions[i - 1];

		for (let j = 0; j < maxTasksPerUser; j++) {
			const taskValue = (j + 1) * 10; // Assigning values 10, 20, 30, etc.
			const taskDescription = `test task description ${j === 2 ? "longer text example" : ""}`;
			const data = {
				user: userName,
				command: "taskAdd",
				message: `${taskDescription}:${taskValue}`,
				flags: { broadcaster: true, mod: false },
				extra: {
					userColor: userColor,
					messageId: `${generateTimeStamp()}`,
				},
			};
			setTimeout(() => {
				twitchClient.emit("command", data);
			}, 1000 * i + j * 100);
		}

		setTimeout(() => {
			const data = {
				user: userName,
				command: "done",
				message: "1",
				flags: { broadcaster: true, mod: false },
				extra: {
					userColor: userColor,
					messageId: `${generateTimeStamp()}`,
				},
			};
			twitchClient.emit("command", data);
		}, 1000 * i + 10000);
	}
}

function generateTimeStamp() {
	const randomNum = Math.floor(Math.random() * 1000000000);
	return `${randomNum}`;
}
