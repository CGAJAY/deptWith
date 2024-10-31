import { isValidObjectId, startSession } from "mongoose";
import { Balance } from "../database/models/Balance.model.js";
import { User } from "../database/models/User.model.js";
import { Transaction } from "../database/models/Transaction.model.js";
import { StatusCodes } from "http-status-codes";

export const createTransaction = async (req, res) => {
	// Get the currently logged-in user and transaction details
	const { userId } = req;
	let { amount, transaction_type } = req.body;

	// Ensure that the amount is a number and greater than 0
	amount = parseInt(amount);
	if (isNaN(amount) || amount <= 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "Amount must be a positive number",
		});
	}

	// Capitalize the transaction type (e.g., "Deposit", "Withdrawal")
	transaction_type =
		transaction_type.charAt(0).toUpperCase() +
		transaction_type.slice(1).toLowerCase();

	// Start a MongoDB session
	const session = await startSession();
	session.startTransaction();

	try {
		// Fetch the user's balance within the transaction session
		const userBalanceDoc = await Balance.findOne({
			user: userId,
		}).session(session);

		if (!userBalanceDoc)
			throw new Error("User balance document not found");

		const userBalance = userBalanceDoc.balance;

		// Handle deposit transactions
		if (transaction_type === "Deposit") {
			// Deposit limitations
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

			// Increase the balance by the amount
			userBalanceDoc.balance += amount;
			await userBalanceDoc.save({ session });

			// Create a transaction document
			const transactionDoc = await Transaction.create(
				[
					{
						user: userId,
						amount,
						transaction_type,
					},
				],
				{ session }
			);

			// Commit the transaction
			await session.commitTransaction();

			console.log(transactionDoc);

			// Remove unneeded values for response and send success
			const { _id, user, updatedAt, __v, ...transaction } =
				transactionDoc.toObject();

			return res.status(StatusCodes.OK).json({
				balance: userBalanceDoc.balance,
				transaction,
			});
		} else if (transaction_type === "Withdrawal") {
			// Handle withdrawal transactions
			if (userBalance < amount) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					message: "Not enough balance",
				});
			}

			// Deduct the amount from the balance
			userBalanceDoc.balance -= amount;
			await userBalanceDoc.save({ session });

			// Create a transaction document
			const transactionDoc = await Transaction.create(
				[
					{
						user: userId,
						amount,
						transaction_type,
					},
				],
				{ session }
			);

			// Commit the transaction
			await session.commitTransaction();

			// Remove unneeded values for response and send success
			const { _id, user, updatedAt, __v, ...transaction } =
				transactionDoc[0].toObject();

			return res.status(StatusCodes.OK).json({
				balance: userBalanceDoc.balance,
				transaction,
			});
		} else {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: "Invalid transaction type",
			});
		}
	} catch (error) {
		console.log({ TransactionError: error });

		// Abort the transaction on error and send failure response
		await session.abortTransaction();
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				message:
					"Something went wrong while processing your request.",
			});
	} finally {
		// End the session
		session.endSession();
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

		return res
			.status(StatusCodes.OK)
			.json({ mesage: transactions });
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
