// Import 'model' and 'Schema' from mongoose
// 'Schema' is used to define the structure of documents in a MongoDB collection
// 'model' creates a usable model based on the schema, allowing interaction with the collection
import { model, Schema } from "mongoose";

// Define the schema for a 'Balance' collection in the database
// The schema outlines the fields and their types for each balace document
const balanceSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		balance: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Balance = model("Balance", balanceSchema);

export { Balance };
