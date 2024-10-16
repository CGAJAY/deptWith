// Import the Router function from the express library
// Router is used to create modular route handlers, allowing us to create isolated routing logic
import { Router } from "express";

// Create a new instance of Router for version 2 of my API
const v2Router = Router();

// Define a GET route for the base URL ("/") of version 2 API
// When a GET request is made to "/api/v2/", this function will be executed
v2Router.get("/", (req, res) => {
	// The handler sends a response with the text "Hello from v2"
	res.send("Hello from v2");
});

// Export the v2Router so that it can be used in other parts of your application
export { v2Router };
