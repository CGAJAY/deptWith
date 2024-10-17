// Middleware function to validate user registration input
export const validateUserRegistration = async (
	req,
	res,
	next
) => {
	// Destructuring user data from the request body
	const { username, email, phone, password } = req.body;

	// Check if all fields are provided
	if (!username || !email || !phone || !password) {
		// If any field is missing, respond with a 400 status and an error message
		res.status(400).json({
			message: "All fields are required.",
		});
		return; // Exit the function if validation fails
	}

	// Check if the username is an empty string
	if (username.trim() === "") {
		// If the username is empty, respond with a 400 status and an error message
		res.status(400).json({
			message: "Username cannot be empty",
		});
		return; // Exit the function if validation fails
	}

	// Validate the email format using a regular expression (regex)
	const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

	// Test the email against the regex pattern
	if (!emailRegex.test(email)) {
		// If the email doesn't match the pattern, respond with a 400 status and an error message
		res.status(400).json({
			message: "Email is invalid",
		});
		return; // Exit the function if validation fails
	}

	// Password validation format using a regular expression (regex)
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

	// Check if the password meets the criteria
	if (!passwordRegex.test(password)) {
		// If the password is invalid, respond with a 400 status and an error message
		res.status(400).json({
			message:
				"Password must be at least 6 characters long, contain at least one number, one lowercase letter, and one uppercase letter.",
		});
		return; // Exit the function if validation fails
	}

	// Phone number validation format using a regular expression (regex)
	const phoneRegex = /^\+?[1-9]\d{1,14}$/;

	// Test the phone number against the regex pattern
	if (!phoneRegex.test(phone)) {
		// If the phone number doesn't match the pattern, respond with a 400 status and an error message
		res.status(400).json({
			message:
				"Phone number is invalid. It should be in international format (e.g., +1234567890).",
		});
		return; // Exit the function if validation fails
	}

	// Call the next middleware function if all validations pass
	next();
};

// Middleware function to validate user login input
export const validateUserLogin = (req, res, next) => {
	// Destructure the email and password from the request body
	const { username, password } = req.body;

	// Check if username & password are provided
	if (!username || !password) {
		// If either field is missing, respond with a 400 status and an error message
		res.status(400).json({
			message: "All fields are required.",
		});
		return; // Exit the function if validation fails
	}

	// Check if the username is an empty string
	if (username.trim() === "") {
		// If the username is empty, respond with a 400 status and an error message
		res.status(400).json({
			message: "Username cannot be empty",
		});
		return; // Exit the function if validation fails
	}

	// Check if the password length is greater than 5 characters
	if (password.length < 6) {
		// If the password is too short, respond with a 400 status and an error message
		res.status(400).json({
			message: "Password must be longer than 5 characters.",
		});
		return; // Exit the function if validation fails
	}

	// If all validations pass, call the next middleware or controller
	next();
};
