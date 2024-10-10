import express from "express";

const balanceRouter = express.Router();

balanceRouter.get("/:userId", (req, res) => {
	const userId = req.params.userId;

	const balance = 100;
	return res.json({ userId, balance });
});

export default balanceRouter;
