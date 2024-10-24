// checks if a given id is in the correct format.
import { isValidObjectId } from "mongoose";
import { Balance } from "../database/models/Balance.model.js";

// This function retrieves a user's balance by their id
export const getUserBalance = async (req, res) => {
	try {
		// remember after the user logs in and the token is created  saved in a cookie
		// For the other endpoint we check for a cookie and validate the token
		// If the token is valid, the server decodes it and extracts user's _id
		// userId property holding the user's id is then added to the req object , making it accessible in subsequent route handlers.

		// Extract the id of the logged-in user (the one making the request)
		const { userId: loggedInUser } = req;

		// Extract the ID of the user whose balance is being requested (from the URL params)
		const { userId: userWeAreInterestedIn } = req.params;

		// Check if the userWeAreInterestedIn has a valid MongoDB ObjectId
		if (!isValidObjectId(userWeAreInterestedIn)) {
			// If the id is not valid, send a 400 error response (bad request)
			return res.status(400).json({
				message: "Deformed id Passed", // Send this message for an invalid ID
			});
		}

		// Look for the balance of the user with the Id userWeAreInterestedIn in the Balance collection
		const userBalance = await Balance.findOne({
			user: userWeAreInterestedIn,
		});

		// If no balance is found for the user, send a 400 error response
		if (!userBalance) {
			return res.status(400).json({
				message: "User with that ID does not exist", // The user with that ID doesn't have a balance
			});
		}

		// If the balance is found, send the balance as part of the JSON response
		res.json({
			balance: userBalance.balance, // Send back the balance (or 0 if it's not defined)
		});
	} catch (error) {
		// Catch any errors (e.g., database issues) and respond with a 500 status code
		res.status(500).json({
			message: "Something went wrong", // Generic error message for server-side errors
		});
	}
};
