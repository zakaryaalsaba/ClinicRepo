// handlers/medicalRecordsHandler.js
import { db } from '../db.js';

// Get all medical records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medicalRecords');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single medical record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medicalRecords WHERE recordId=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Medical record not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { patientId, doctorId, diagnosis, prescription, attachments } = req.body;

    const [result] = await db.query(
      `INSERT INTO medicalRecords
       (patientId, doctorId, diagnosis, prescription, attachments, createdBy)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patientId, doctorId, diagnosis, prescription, JSON.stringify(attachments), createdBy]
    );

    res.json({ recordId: result.insertId });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a medical record
export const updateMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis, prescription, attachments } = req.body;

    await db.query(
      `UPDATE medicalRecords 
       SET patientId=?, doctorId=?, diagnosis=?, prescription=?, attachments=? 
       WHERE recordId=?`,
      [patientId, doctorId, diagnosis, prescription, JSON.stringify(attachments), req.params.id]
    );

    res.json({ message: 'Medical record updated' });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a medical record
export const deleteMedicalRecord = async (req, res) => {
  try {
    await db.query('DELETE FROM medicalRecords WHERE recordId=?', [req.params.id]);
    res.json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};