import { Router } from "express";

const v2Router = Router();

v2Router.get("/", (req, res) => {
	res.send("Hello from v2");
});

export { v2Router };
