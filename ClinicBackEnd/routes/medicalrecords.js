// routes/medicalRecords.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../handlers/medicalRecordsHandler.js';

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read
router.get('/', getAllMedicalRecords);
router.get('/:id', getMedicalRecordById);

// ✅ Only Admin and Doctor can create/update
router.post('/', authorizeRole(['Admin', 'Doctor']), createMedicalRecord);
router.put('/:id', authorizeRole(['Admin', 'Doctor']), updateMedicalRecord);

// ✅ Only Admin can delete
router.delete('/:id', authorizeRole(['Admin']), deleteMedicalRecord);

export default router;