// Middleware function to validate user registration input
export const validateUserRegistration = async (
	req,
	res,
	next
) => {
	try {
		// Destructuring user data from the request body
		const { username, email, phone, password } = req.body;

		// Check if all fields are provided
		if (!username || !email || !phone || !password) {
			return res
				.status(400)
				.json({ message: "All fields are required." });
		}

		// Check if the username is an empty string
		if (username.trim() === "") {
			return res
				.status(400)
				.json({ message: "Username cannot be empty." });
		}

		// email: john@doe.com
		// const emailArray = email.split("@")
		// emailArray: ["john", "doe.com"]

		// if (!emailArray[0] || !emailArray[1]) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Email is Invalid" });
		// }

		// second part of the email: doe.com
		// const emailSecondPart = emailArray[1].split(".")
		// emailSecondPart: ["doe", "com"]

		// if (!emailSecondPart[0] || !emailSecondPart[1]) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Email is Invalid" });
		// }

		// Validate the email format using a regular expression (regex)
		const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ message: "Email is invalid." });
		}

		// Password validation
		if (password.length < 6) {
			return res.status(400).json({
				message:
					"Password must be at least 6 characters long.",
			});
		}

		let hasLowerCase = false;
		let hasUpperCase = false;
		let hasNumber = false;

		// Iterate through each char in the password
		for (let i = 0; i < password.length; i++) {
			let char = password[i];
			if (char >= "a" && char <= "z") {
				hasLowerCase = true;
			} else if (char >= "A" && char <= "Z") {
				hasUpperCase = true;
			} else if (char >= "0" && char <= "9") {
				hasNumber = true;
			}
		}

		// Check if all conditions are met
		if (!hasLowerCase || !hasUpperCase || !hasNumber) {
			return res.status(400).json({
				message:
					"Password must contain at least one lowercase letter, one uppercase letter, and one number.",
			});
		}

		// Remove any spaces in the number
		const trimmedPhone = phone.trim();

		// Check if the phone is an empty string
		if (trimmedPhone === "") {
			return res
				.status(400)
				.json({ message: "Phone cannot be empty." });
		}

		// Check if phone number is exactly 10 digits
		if (trimmedPhone.length !== 10) {
			return res.status(400).json({
				message: "Phone number must be 10 digits long.",
			});
		}

		// Check if phone number starts with 07
		if (
			trimmedPhone[0] !== "0" ||
			trimmedPhone[1] !== "7"
		) {
			return res.status(400).json({
				message: "Phone number must start with '07'.",
			});
		}

		// Check if all characters in the phone are digits
		for (let char of trimmedPhone) {
			if (char < "0" || char > "9") {
				return res.status(400).json({
					message: "Phone number must only contain digits.",
				});
			}
		}

		// Call the next middleware function if all validations pass
		next();
	} catch (error) {
		// Handle any unexpected errors
		console.error(error); // Log the error for debugging
		return res
			.status(500)
			.json({ message: "An unexpected error occurred." });
	}
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
			message: "Password have than 5 characters.",
		});
		return; // Exit the function if validation fails
	}

	// If all validations pass, call the next middleware or controller
	next();
};
