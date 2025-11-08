// routes/doctors.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from '../handlers/doctorsHandler.js';

const router = express.Router();

router.use(authenticateToken);

// ✅ All authenticated users can read doctors
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// ✅ Only Admin can create, update, delete
router.post('/', authorizeRole(['Admin']), createDoctor);
router.put('/:id', authorizeRole(['Admin']), updateDoctor);
router.delete('/:id', authorizeRole(['Admin']), deleteDoctor);

export default router;