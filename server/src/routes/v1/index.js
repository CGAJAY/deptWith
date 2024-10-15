import { Router } from "express";
import { authRouter } from "./auth.js";

const v1Router = Router();

// /api/v1
v1Router.get("/", (req, res) => {
	res.send("Hello from v1");
});

// /api/v1/auth
v1Router.use("/auth", authRouter);

export { v1Router };
