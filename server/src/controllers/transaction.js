import { isValidObjectId } from "mongoose";
import { Balance } from "../database/models/Balance.model.js";
import { User } from "../database/models/User.model.js";
import { Transaction } from "../database/models/Transaction.model.js";
import { StatusCodes } from "http-status-codes";

export const createTransaction = async (req, res) => {
	// Get id of currently logged in user from request object
	const { userId } = req;

	// get transaction details from the request body
	let { amount, transaction_type } = req.body;

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

	// Grab transaction_type and reasign it the value in the correct format
	// transaction_type.charAt(0).toUpperCase(); get 1st char & converts to upperCase
	// transaction_type.slice(1).toLowerCase(); get rest of the string and converts to lowerCase
	transaction_type =
		transaction_type.charAt(0).toUpperCase() +
		transaction_type.slice(1).toLowerCase();

	try {
		// Get the Balance document for the logged in user
		const userBalanceDoc = await Balance.findOne({
			user: userId,
		});

		// Grab the balance from the balance document
		const userBalance = userBalanceDoc.balance;

		// Check if transaction_type === Deposit
		if (transaction_type === "Deposit") {
			// handle deposits
			// Deposits limitations

			if (amount < 100) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message:
						"Amount is less than the allowed minimum of 100",
				});
			}

			if (amount > 100000) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message:
						"Amount is more than the allowed maximum of 100000",
				});
			}

			// if type is deposit, increase the logged in user's balance by the amount
			userBalanceDoc.balance += amount;

			// TODO: Introduce transactions to deal with concurrency and incomplete processes

			// op 1 is updating the loggedIn user's balance
			await userBalanceDoc.save();

			// op 2 creating a document for the deposit transaction done by the loggedIn user
			const transactionDoc = await Transaction.create({
				user: userId,
				amount,
				transaction_type,
			});

			// Grab the amount and transaction_type from the transactionDoc
			const { _id, user, updateAt, _v, ...Transaction } =
				transactionDoc.toObject();

			// respond with the updated user balance and the transaction details
			return res.status(StatusCodes.OK).json({
				balance: userBalanceDoc.balance,
				Transaction,
			});
		} else if (transaction_type === "Withdrawal") {
			// Check if currently loggedIn user's balance is more than or equal to the amount
			if (userBalance < amount) {
				// Deny the request
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Not enough balance" });
			}

			// if userBalance > amount deduct amount from the balance
			userBalanceDoc.balance -= amount;

			//Update the userBalanceDoc to refelect the new balance
			await userBalanceDoc.save();

			// Create a transaction document for the transaction made
			const transactionDoc = await Transaction.create({
				user: userId,
				amount,
				transaction_type,
			});

			// Grab the amount and transaction_type from the transactionDoc
			const { _id, user, updateAt, _v, ...Transaction } =
				transactionDoc.toObject();

			// respond with the updated user balance and the transaction details
			return res.status(StatusCodes.OK).json({
				balance: userBalanceDoc.balance,
				Transaction,
			});
		} else {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Transaction type invalid" });
		}
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

export const getUserTransactions = async (req, res) => {
	// Grab the userId from the Request body
	const { userId } = req;

	try {
		// Grab all transactions in the transaction collection
		const transactions = await Transaction.find({
			user: userId,
		});
	} catch (error) {
		console.log({ ServerError: error });
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
