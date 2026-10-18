import { Router } from "express";
import { getMenuItems } from "../controllers/menuItemController.js";

const router = Router();

router.get("/", getMenuItems);

export default router;
