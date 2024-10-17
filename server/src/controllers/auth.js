// Import the 'User' model from the User file, which allows interaction with the User collection in the database
import { User } from "../database/models/User.model.js";

import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// Define an asynchronous function to handle user registration
export const registerUser = async (req, res) => {
	try {
		// Destructure the required fields from the request body
		const { username, email, phone, password } = req.body;

		// Generating a salt for password hashing
		const salt = bcrypt.genSaltSync(10);
		// Hashing the password using the generated salt
		const hashedPassword = bcrypt.hashSync(password, salt);

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

		// Creating a new user in the database with the provided data
		const user = await User.create({
			username,
			email,
			phone,
			password: hashedPassword, // Store the hashed password instead of the plain password
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
export const loginUser = async (req, res) => {
	try {
		// Destructure the email and password from the request body
		const { username, password } = req.body;

		// Check if a user with this email exists in the database
		const user = await User.findOne({ email });

		// If no user is found, return a 400 status with an error message
		if (!user) {
			res.status(400).json({
				message: "Invalid email or password.",
			});
			return; // Exit if the user is not found
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(
			password,
			user.password
		);

		// If the password is incorrect, return a 400 status with an error message
		if (!isPasswordValid) {
			res.status(400).json({
				message: "Invalid email or password.",
			});
			return; // Exit if the password is incorrect
		}

		// If login is successful, send the user data (without the password) as a response
		res.json({
			message: "Login successful",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};
