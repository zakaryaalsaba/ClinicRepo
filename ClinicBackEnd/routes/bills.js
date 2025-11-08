// routes/bills.js
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { getAllBills,getBillById, createBill, updateBill } from "../handlers/billsHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read bills
router.get("/", getAllBills);
router.get("/:id", getBillById);
// ✅ Only Admin & Accountant can create or update bills
router.post("/", authorizeRole(["Admin", "Accountant"]), createBill);
router.put("/:id", authorizeRole(["Admin", "Accountant"]), updateBill);

export default router;