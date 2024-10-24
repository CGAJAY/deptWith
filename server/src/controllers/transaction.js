// Check if user is logged in
// Get the balance of the logged-in user
// Validate the transaction by checking if  (amount > 0 && amount < balance)
// Validate the recipient's ID
// Grab the recepient's balance
// Deduct amount from the sender's balance
// Add amount to recipients's balance

import { isValidObjectId } from "mongoose";
import { Balance } from "../database/models/Balance.model.js";
import { User } from "../database/models/User.model.js";

export const sendTransaction = async (req, res) => {
	const { amount, recipientId } = req.body;

	// Extract the id of the logged-in user (the one making the request)
	const { userId: loggedInUser } = req;

	// Returns the balance document
	const senderBalance = await Balance.findOne({
		user: loggedInUser,
	});

	// Grab the user balance from the balance document
	const senderActualBalance = senderBalance.balance;

	// check if  (amount > 0 && amount < balance)

	const isAmountSendable =
		amount > 0 && amount < senderBalance;

	if (!isAmountSendable) {
		return res.status(400).json({
			message: "Insufficient balance",
		});
	}

	if (!isValidObjectId(recipientId)) {
		return res.status(400).json({
			message: "Deformed id Passed", // Send this message for an invalid ID
		});
	}

	const recipient = await User.findById(recipientId);

	if (!recipient) {
		return res
			.status(400)
			.json({ message: "Wrong number" });
	}

	const recepientBalance = await Balance.findById(
		//Update this
		recipientId
	);

	const ActualRecepientBalance = recepientBalance.balance;

	senderActualBalance -= amount;
	ActualRecepientBalance += amount;
};
