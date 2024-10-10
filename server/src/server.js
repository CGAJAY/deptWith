import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./database/connectDb.js";

configDotenv(); // Load environment variables

const PORT = process.env.PORT;

const app = express();
connectDb();

app.get("/", (req, res) => {
	res.json({
		message: "PhP dev are not gen z's",
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
