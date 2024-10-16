// Middleware function to validate user registration input
export const validateUserRegistration = (
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
	// A basic check to ensure the email is in the format: something@something.something
	const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

	// Test the email against the regex pattern
	if (!emailRegex.test(email)) {
		// If the email doesn't match the pattern, respond with a 400 status and an error message
		res.status(400).json({
			message: "Email is invalid",
		});
		return; // Exit the function if validation fails
	}

	// Later I'll add additional password validation here, such as:
	// - At least 6 characters long
	// - Contains at least one number
	// - Contains at least one lowercase letter
	// - Contains at least one uppercase letter

	// Call the next middleware function if all validations pass
	next();
};

export const validateUserLogin = (req, res, next) => {
	console.log("Validating user login");

	next();
};
