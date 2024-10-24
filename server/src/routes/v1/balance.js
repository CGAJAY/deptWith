import { Router } from "express";
import { getUserBalance } from "../../controllers/balance.js";

const balanceRouter = Router();

// /api/v1/balance/userId
// userId is dynamic
balanceRouter.get("/:userId", getUserBalance);

export { balanceRouter };
