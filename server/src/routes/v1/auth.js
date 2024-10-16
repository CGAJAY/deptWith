// Import the Router function from the express library
// Router allows us to create modular route handlers
import { Router } from "express";

// Import controller functions for user login and registration
// These functions handle the logic for authenticating and creating new users
import {
	loginUser, // Function for handling user login
	registerUser, // Function for handling new user registration
} from "../../controllers/auth.js"; // Importing from the controllers/auth.js file

// Importing the validation middleware functions for login and registration
import {
	validateUserLogin,
	validateUserRegistration,
} from "../../middleware/validators.js";

// Create an instance of the Express Router
// authRouter will handle routes related to authentication (e.g., login and registration)
const authRouter = Router();

// Define a POST route for user registration
// This route is used for registering a new user
authRouter.post(
	"/register",
	validateUserRegistration,
	registerUser
);

// Define a POST route for user login
// This route is used for logging in an existing user
authRouter.post("/login", validateUserLogin, loginUser);

// Export the authRouter so it can be used in other parts of the application
export { authRouter };
