import express from "express";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" }); // Load environment variables

const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
	res.send("Hello PHP dev");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
