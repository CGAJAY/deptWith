import { Schema, model } from "mongoose";

const userBalanceSchema = new Schema(
	{
		// ObjectId to reference another user document
		user_id: {
			type: Schema.Types.ObjectId,
			// Reference to the User model
			ref: "User",
			required: true,
		},
		balance: {
			type: Number, // Balance is a number
			required: true, // Make balance required
			default: 0, // Set default balance to 0
		},
	},
	{
		timestamps: true, // Automatically create createdAt and updatedAt fields
	}
);

// Create a model from the schema
const UserBalance = model("UserBalance", userBalanceSchema);

// Export the model
export default UserBalance;
