// Import the Router function from express
import { Router } from "express";

// Import the authRouter from the auth.js file
import { authRouter } from "./auth.js";

// Import the balanceRouter from the balance.js file
import { balanceRouter } from "./balance.js";

// middleware to authenticate if user is logged in
import { requiresAuthentication } from "../../middleware/auth.js";

// Create a new instance of Router for version 1 of the API
const v1Router = Router();

// PUBLIC ROUTES (don't require user to be logged in inorder to access them)
// /api/v1
v1Router.get("/", (req, res) => {
	res.send("Hello from v1");
});

// When a request is made to "/api/v1/auth", the authRouter will handle it
v1Router.use("/auth", authRouter);

// PRIVATE ROUTES (require a user to be logged in inorder to access them)
v1Router.use(requiresAuthentication); // Protects all routes after it

// /api/v1/balance
v1Router.use("/balance", balanceRouter);

// /api/v1/protected
v1Router.get("/protected", (req, res) => {
	res.json({
		message: "This is a protected route",
	});
});

// Export the v1Router so it can be used in the main application file
export { v1Router };
