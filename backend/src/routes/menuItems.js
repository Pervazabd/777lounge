import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAdminMenuItems,
  reorderMenuCategories,
  reorderMenuItems,
  updateMenuItem,
} from "../controllers/adminMenuItemController.js";
import { getMenuItems } from "../controllers/menuItemController.js";
import { requireAdminKey } from "../middleware/requireAdminKey.js";

const router = Router();

router.get("/", getMenuItems);
router.use("/admin", requireAdminKey);
router.get("/admin", getAdminMenuItems);
router.post("/admin", createMenuItem);
router.put("/admin/reorder", reorderMenuItems);
router.put("/admin/reorder-categories", reorderMenuCategories);
router.put("/admin/:id", updateMenuItem);
router.delete("/admin/:id", deleteMenuItem);

export default router;
