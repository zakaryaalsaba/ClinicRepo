// routes/patients.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from '../handlers/patientsHandler.js';

const router = express.Router();

// Apply JWT authentication
router.use(authenticateToken);

// ✅ Public (read) routes for any authenticated user
router.get('/', getAllPatients);
router.get('/:id', getPatientById);

// ✅ Restricted (write) routes
router.post('/', authorizeRole(['Admin', 'Receptionist']), createPatient);
router.put('/:id', authorizeRole(['Admin', 'Receptionist']), updatePatient);
router.delete('/:id', authorizeRole(['Admin']), deletePatient);

export default router;