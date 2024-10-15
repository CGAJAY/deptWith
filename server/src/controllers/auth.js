import { User } from "../database/Models/User.js";

// async... await
// then...catch
export const registerUser = async (req, res) => {
	try {
		const { username, email, phone, password } = req.body;

		if (!username || !email || !phone || !password) {
			res.status(400).json({
				message: "All fields are required.",
			});
			return;
		}

		if (username.trim() === "") {
			res.status(400).json({
				message: "Username cannot be empty",
			});
			return;
		}

		// email: john@doe.com
		// emailArray: ["john", "doe.com"]
		// const emailArray = email.split("@");

		// if (!emailArray[0] || !emailArray[1]) {
		//   res.status(400).json({
		//     message: "Email is invalid",
		//   });
		//   return;
		// }

		// // second part: doe.com
		// // emailSecondPart: ["doe", "com"]
		// const emailSecondPart = emailArray[1].split(".");

		// if (!emailSecondPart[0] || !emailSecondPart[1]) {
		//   res.status(400).json({
		//     message: "Email is invalid 2",
		//   });
		//   return;
		// }

		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

		if (!emailRegex.test(email)) {
			res.status(400).json({
				message: "Email is invalid 3",
			});
			return;
		}

		const user = await User.create({
			username,
			email,
			phone,
			password,
		});

		res.json(user);
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
		});
	}
};

export const loginUser = (req, res) => {
	res.send("Get login endpoint");
};
