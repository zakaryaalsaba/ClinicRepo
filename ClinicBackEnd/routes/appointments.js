import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../handlers/appointmentsHandler.js';

const router = express.Router();

router.use(authenticateToken);

// Read access (any authenticated user)
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);

// Write access (Admin, Receptionist, Doctor)
router.post('/', authorizeRole(['Admin', 'Receptionist', 'Doctor']), createAppointment);
router.put('/:id', authorizeRole(['Admin', 'Receptionist', 'Doctor']), updateAppointment);

// Delete access (Admin only)
router.delete('/:id', authorizeRole(['Admin']), deleteAppointment);

export default router;