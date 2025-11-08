import { db } from '../db.js';

export const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointments WHERE appointmentId=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Appointment not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointment_date, status, notes } = req.body;
    const createdBy = req.user.userId; // ✅ capture logged-in user

    const [result] = await db.query(
      `INSERT INTO appointments (patientId, doctorId, appointment_date, status, notes, createdBy)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patientId, doctorId, appointment_date, status, notes, createdBy]
    );

    res.json({ appointmentId: result.insertId });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointment_date, status, notes } = req.body;
    await db.query(
      'UPDATE appointments SET patientId=?, doctorId=?, appointment_date=?, status=?, notes=? WHERE appointmentId=?',
      [patientId, doctorId, appointment_date, status, notes, req.params.id]
    );
    res.json({ message: 'Appointment updated' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE appointmentId=?', [req.params.id]);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};