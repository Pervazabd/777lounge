import { Router } from "express";
import { getHealth } from "../controllers/healthController.js";
import menuItemsRouter from "./menuItems.js";
import reservationsRouter from "./reservations.js";

const router = Router();

router.get("/health", getHealth);
router.use("/products", menuItemsRouter);
router.use("/reservations", reservationsRouter);

export default router;
