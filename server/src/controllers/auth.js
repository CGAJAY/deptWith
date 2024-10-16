// Import the 'User' model from the User file, which allows interaction with the User collection in the database
import { User } from "../database/models/User.model.js";

// Define an asynchronous function to handle user registration
export const registerUser = async (req, res) => {
	try {
		// Destructure the required fields from the request body
		const { username, email, phone, password } = req.body;

		// Check if any of the required fields are missing and send a 400 error response if so
		if (!username || !email || !phone || !password) {
			res.status(400).json({
				message: "All fields are required.",
			});
			return;
		}

		// Check if the username is an empty string (after removing whitespace) and send a 400 error if it is
		if (username.trim() === "") {
			res.status(400).json({
				message: "Username cannot be empty",
			});
			return;
		}

		// Validate the email format using a regular expression (regex)
		// A basic check to ensure the email is in the format: something@something.something
		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

		// If the email doesn't match the regex pattern, return a 400 error with a message
		if (!emailRegex.test(email)) {
			res.status(400).json({
				message: "Email is invalid 3",
			});
			return;
		}

		// Create a new user in the database using the provided details
		const user = await User.create({
			username,
			email,
			phone,
			password,
		});

		// Send back the created user data as a response
		res.json(user);
	} catch (error) {
		// If something goes wrong, send a 500 error response indicating a server issue
		res.status(500).json({
			message: "Something went wrong",
		});
	}
};

// Define the loginUser function to handle login requests
export const loginUser = (req, res) => {
	res.send("Get login endpoint");
};
