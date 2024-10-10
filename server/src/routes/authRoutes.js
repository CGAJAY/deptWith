// routes/authRoutes.js

import express from "express";

const authRouter = express.Router();

// route for authentication
authRouter.post("/login", (req, res) => {
	const { email, password } = req.body;

	// For demonstration, return a static response
	// In a real application, you'd verify credentials here
	if (
		email === "user@gmail.com" &&
		password === "password"
	) {
		return res.json({
			message: "Login successful",
			user: { email },
		});
	}
	return res
		.status(401)
		.json({ message: "Invalid email or password" });
});

export default authRouter;
