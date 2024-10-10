import { connect } from "mongoose";

const connectDb = async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("Database connected successfully");
	} catch (error) {
		console.log("Database connection error", error);
	}
};

export default connectDb;
