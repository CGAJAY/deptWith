import { Router } from "express";
import {
	loginUser,
	registerUser,
} from "../../controllers/auth.js";

const authRouter = Router();

// /api/v1/auth/register
authRouter.post("/register", registerUser);

// /api/v1/auth/login
authRouter.post("/login", loginUser);

export { authRouter };
