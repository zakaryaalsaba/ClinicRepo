import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication
} from "../handlers/medicationsHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read
router.get("/", getAllMedications);
router.get("/:id", getMedicationById);

// ✅ Only Admin and Doctor can create
router.post("/", authorizeRole(["Admin", "Doctor"]), createMedication);

// ✅ Only Admin and Doctor can update
router.put("/:id", authorizeRole(["Admin", "Doctor"]), updateMedication);

// ✅ Only Admin can delete
router.delete("/:id", authorizeRole(["Admin"]), deleteMedication);

export default router;