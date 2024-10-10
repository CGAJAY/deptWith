import express from "express";

const transactionsRouter = express.Router();

transactionsRouter.get("/:userId", (req, res) => {
	const userId = req.params.userId;

	const transactions = [
		{
			id: 1,
			userId,
			amount: 50,
			type: "credit",
			date: "2024-10-01",
		},
		{
			id: 2,
			userId,
			amount: 30,
			type: "debit",
			date: "2024-10-02",
		},
	];
	return res.json({ userId, transactions });
});

export default transactionsRouter;
