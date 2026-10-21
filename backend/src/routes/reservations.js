import { Router } from "express";
import {
  cancelReservation,
  createReservation,
  deleteAllReservations,
  deleteReservation,
  getAdminReservations,
} from "../controllers/reservationController.js";
import { requireAdminKey } from "../middleware/requireAdminKey.js";

const router = Router();

router.post("/", createReservation);
router.use("/admin", requireAdminKey);
router.get("/admin", getAdminReservations);
router.patch("/admin/:id/cancel", cancelReservation);
router.delete("/admin/all", deleteAllReservations);
router.delete("/admin/:id", deleteReservation);

export default router;
