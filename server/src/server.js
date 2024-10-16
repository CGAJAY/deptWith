// Import necessary modules
// Express for building web applications in Node.js
import express from "express";
// dotenv loads environment variables from a .env file into process.env
import { configDotenv } from "dotenv";
// Import a function to connect to the database
import connectDb from "./database/connectDb.js";
// Import route handlers for API version 1
import { v1Router } from "./routes/v1/index.js";
// Import route handlers for API version 2
import { v2Router } from "./routes/v2/index.js";

// Load environment variables from the .env file into process.env
configDotenv();

// Connect to the database by calling the function I imported
connectDb();

// Get the port number from environment variables (specified in the .env file)
const PORT = process.env.PORT;

// Create an instance of the Express application
const app = express();

// Middleware to parse JSON bodies in incoming requests
// This allows me to access the request body as `req.body` in JSON format
app.use(express.json());

// ROUTES (Define API endpoints)

// Defines all routes starting with "/api/v1" using the v1Router
app.use("/api/v1", v1Router);

// Defines all routes starting with "/api/v2" using the v2Router
app.use("/api/v2", v2Router);

// Handle all other undefined routes (e.g., if no matching route is found)
// This returns a 404 status with a "Not found" message
app.use("*", (req, res) => {
	res.status(404).json({
		message: "Not found", // Response message for undefined routes
	});
});

// Start the server and make it listen on the defined port
// The server will print a message to the console when it's running
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
