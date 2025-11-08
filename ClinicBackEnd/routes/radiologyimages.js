// routes/radiologyImages.js
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
import { 
  getAllRadiologyImages, 
  createRadiologyImage, 
  updateRadiologyImageStatus,
  getRadiologyImageById
} from "../handlers/radiologyImagesHandler.js";

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read
router.get("/", getAllRadiologyImages);
// ✅ Get a single radiology image by ID
router.get("/:id", getRadiologyImageById);

// ✅ Only Admin, Doctor, Radiologist can create
router.post("/", authorizeRole(["Admin", "Doctor", "Radiologist"]), createRadiologyImage);

// ✅ Only Radiologist, Admin can update status
router.put("/:id", authorizeRole(["Radiologist", "Admin"]), updateRadiologyImageStatus);

export default router;