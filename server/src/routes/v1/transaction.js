import { Router } from "express";
import { createTransaction } from "../../controllers/transaction";

const transactionRouter = Router();

// POST api/v1/transaction
transactionRouter
	.route("/") // setting up the root path for the router
	.post(createTransaction); //handle post requests to create a new transaction

export { transactionRouter };
