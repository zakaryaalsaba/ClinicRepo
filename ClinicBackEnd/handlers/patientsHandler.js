// handlers/patientsHandler.js
import { db } from '../db.js';

export const getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE patientId=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Patient not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPatient = async (req, res) => {
  try {
    // Safety check
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }
    const { firstName, lastName, gender, dob, phone, email, address } = req.body;
    const createdBy = req.user.userId;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required" });
    }    

    const [result] = await db.query(
      `INSERT INTO patients (firstName, lastName, gender, dob, phone, email, address, createdBy) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, gender, dob, phone, email, address, createdBy]
    );

    res.json({ patientId: result.insertId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }    
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { firstName, lastName, gender, dob, phone, email, address } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required" });
    }    
    await db.query(
      `UPDATE patients 
       SET firstName=?, lastName=?, gender=?, dob=?, phone=?, email=?, address=? 
       WHERE patientId=?`,
      [firstName, lastName, gender, dob, phone, email, address, req.params.id]
    );
    res.json({ message: 'Patient updated' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePatient = async (req, res) => {
  try {
    await db.query('DELETE FROM patients WHERE patientId=?', [req.params.id]);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};