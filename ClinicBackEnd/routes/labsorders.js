import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  getAllLabOrders,
  getLabOrderById,
  createLabOrder,
  updateLabOrder
} from "../handlers/labsOrdersHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can view lab orders
router.get("/", getAllLabOrders);
router.get("/:id", getLabOrderById);

// ✅ Only Admin, Doctor, Lab can create lab orders
router.post("/", authorizeRole(["Admin", "Doctor", "Lab"]), createLabOrder);

// ✅ Only Lab and Admin can update status/results
router.put("/:id", authorizeRole(["Lab", "Admin"]), updateLabOrder);

export default router;