// Import 'model' and 'Schema' from mongoose
// 'Schema' is used to define the structure of documents in a MongoDB collection
// 'model' creates a usable model based on the schema, allowing interaction with the collection
import { model, Schema } from "mongoose";

// Define the schema for a 'User' collection in the database
// The schema outlines the fields and their types for each user document
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const User = model("User", userSchema);

export { User };
