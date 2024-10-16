// Import 'model' and 'Schema' from mongoose
// 'Schema' is used to define the structure of documents in a MongoDB collection
// 'model' creates a usable model based on the schema, allowing interaction with the collection
import { model, Schema } from "mongoose";

// Define the schema for a 'Transaction' collection in the database
// The schema outlines the fields and their types for each transaction document
const transactionSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		transaction_type: {
			type: String,
			enum: ["Deposit", "Withdrawal"],
			required: true,
		},
	},
	{ timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

export { Transaction };
