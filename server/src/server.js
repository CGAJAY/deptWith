import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./database/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import balanceRouter from "./routes/balanceRoutes.js";
import transactionsRouter from "./routes/transactionRoutes.js";

import { v1Router } from "./routes/v1/index.js";
import { v2Router } from "./routes/v2/index.js";

configDotenv(); // Load environment variables

const PORT = process.env.PORT;

// Create an Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
connectDb();

app.use("/auth", authRouter);
app.use("/balance", balanceRouter);
app.use("/transactions", transactionsRouter);

// ROUTES
app.get("/", (req, res) => {
	console.log("Request received on root path");
	res.json({
		message: "Silence is golden",
	});
});

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
