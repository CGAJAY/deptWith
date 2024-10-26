import { Router } from "express";
import {
	createTransaction,
	getUserTransactions,
} from "../../controllers/transaction.js";

const transactionRouter = Router();

// POST api/v1/transaction
transactionRouter
	.route("/") // setting up the root path for the router
	.get(getUserTransactions) // handle get request to fetch all user transactions
	.post(createTransaction); //handle post requests to create a new transaction

export { transactionRouter };
