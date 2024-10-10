import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./database/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import balanceRouter from "./routes/balanceRoutes.js";
import transactionsRouter from "./routes/transactionRoutes.js";

configDotenv(); // Load environment variables

const PORT = process.env.PORT;

// Create an Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
connectDb();

app.use("/auth", authRouter);
app.use("/balance", balanceRouter);
app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
