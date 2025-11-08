import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { 
  getAllPatientInsurance,
  getAllPatientInsuranceById,
  createPatientInsurance,
  updatePatientInsurance,
  deletePatientInsurance
} from "../handlers/patientInsuranceHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ Read access
router.get("/", getAllPatientInsurance);
router.get("/:id", getAllPatientInsuranceById);

// ✅ Write access
router.post("/", authorizeRole(["Admin", "Receptionist"]), createPatientInsurance);
router.put("/:id", authorizeRole(["Admin", "Receptionist"]), updatePatientInsurance);
router.delete("/:id", authorizeRole(["Admin"]), deletePatientInsurance);

export default router;