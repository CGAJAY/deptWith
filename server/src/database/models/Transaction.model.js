import { Schema, model } from "mongoose";

// Define the Transaction schema
const transactionSchema = new Schema(
	{
		user_id: {
			// Use ObjectId to reference another document
			type: Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true, // Make user_id required
		},
	},
	{
		timestamps: true, // Automatically create createdAt and updatedAt fields
	}
);

// Create a model from the schema
const Transaction = model("Transaction", transactionSchema);

// Export the model
export default Transaction;
