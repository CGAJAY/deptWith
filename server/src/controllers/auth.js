// Import the 'User' model from the User file, which allows interaction with the User collection in the database
import { User } from "../database/models/User.model.js";
import { Balance } from "../database/models/Balance.model.js";

import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// Define an asynchronous function to handle user registration
export const registerUser = async (req, res) => {
	try {
		// Destructure the required fields from the request body
		const { username, email, phone, password } = req.body;

		// Generating a salt for password hashing
		// Ensures hashed paasword are unique even if two users hve same password
		const salt = bcrypt.genSaltSync(10);
		// Hashing the password using the generated salt
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Creating a new user in the database with the provided data
		const user = await User.create({
			username,
			email,
			phone,
			password: hashedPassword, // Store the hashed password instead of the plain password
		});

		// Create balance for the user
		await Balance.create({ user: user._id });

		// Send back 200 response indicating OK the user was created
		res
			.status(201)
			.json({ message: "User was created successfully" });
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
		const isPasswordMatch = await bcrypt.compare(
			password,
			user.password
		);

		// If the password is incorrect, return a 400 status with an error message
		if (!isPasswordMatch) {
			res.status(400).json({
				message: "Incorrect credentials - password.",
			});
			return; // Exit if the password is incorrect
		}

		// Cookie in res object to store the cookie in the browser
		res.cookie(
			process.env.AUTH_COOKIE_NAME, // Name of the cookie
			// Value of cookie, which is the user object converted to JSON
			JSON.stringify(user.toObject())
		);

		// If login is successful, send the user data (without the password) as a response
		res.json({
			message: "Login successful",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};
