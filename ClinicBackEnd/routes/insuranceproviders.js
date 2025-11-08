import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { 
  getAllProviders, 
  getProviderById, 
  createProvider, 
  updateProvider, 
  deleteProvider 
} from "../handlers/insuranceProvidersHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read
router.get("/", getAllProviders);
router.get("/:id", getProviderById);

// ✅ Only Admin can create, update, delete
router.post("/", authorizeRole(["Admin"]), createProvider);
router.put("/:id", authorizeRole(["Admin"]), updateProvider);
router.delete("/:id", authorizeRole(["Admin"]), deleteProvider);

export default router;