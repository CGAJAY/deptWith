import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./database/connectDb.js";
import { v1Router } from "./routes/v1/index.js";
import { v2Router } from "./routes/v2/index.js";

configDotenv(); // Load environment variables

connectDb();

const PORT = process.env.PORT;

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// ROUTES

// END ROUTES
app.use("/api/v1", v1Router);

app.use("/api/v2", v2Router);

app.use("*", (req, res) => {
	res.status(404).json({
		message: "Not found",
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
