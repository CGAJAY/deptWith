// Import the Router function from express
import { Router } from "express";

// Import the authRouter from the auth.js file
// This is where authentication-related routes (like login and register) are defined
import { authRouter } from "./auth.js";

// Create a new instance of Router for version 1 of the API
const v1Router = Router();

// Define a GET route for the base URL ("/") of version 1 API
// This route will respond with the message "Hello from v1" when a GET request is made to "/api/v1/"
v1Router.get("/", (req, res) => {
	res.send("Hello from v1");
});

// When a request is made to "/api/v1/auth", the authRouter will handle it
v1Router.use("/auth", authRouter);

// Export the v1Router so it can be used in the main application file
export { v1Router };
