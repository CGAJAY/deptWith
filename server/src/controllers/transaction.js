import { isValidObjectId } from "mongoose";
import { Balance } from "../database/models/Balance.model.js";
import { User } from "../database/models/User.model.js";
import { Transaction } from "../database/models/Transaction.model.js";
import { StatusCodes } from "http-status-codes";

export const createTransaction = async (req, res) => {
	// Get id of currently logged in user from request object
	const { userId } = req;

	// get transaction details from the request body
	let { amount, transactionType } = req.body;

	// Check if type of amount is not a number
	// isNaN checks if result is (NaN), if true code executes
	if (isNaN(parseInt(amount))) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Amount must be a number" });
	}

	// Check if amount is === 0
	if (parseInt(amount) === 0) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Amount must be more than 0" });
	}

	// Grab transactionType and reasign it the value in the correct format
	// transactionType.charAt(0).toUpperCase(); get 1st char & converts to upperCase
	// transactionType.slice(1).toLowerCase(); get rest of the string and converts to lowerCase
	transactionType =
		transactionType.charAt(0).toUpperCase() +
		transactionType.slice(1).toLowerCase();

	try {
		// Get the Balance document for the logged in user
		const userBalanceDoc = await Balance.findOne({
			user: userId,
		});

		// Grab the balance from the balance document
		const userBalance = userBalanceDoc.balance;
	} catch (error) {
		console.log({ TransactionError: error });
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				message:
					"Something went wrong while processing your request",
			});
	}
};

// Check if user is logged in
// Get the balance of the logged-in user
// Validate the transaction by checking if  (amount > 0 && amount < balance)
// Validate the recipient's ID
// Grab the recepient's balance
// Deduct amount from the sender's balance
// Add amount to recipients's balance

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
