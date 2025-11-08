// handlers/doctorsHandler.js
import { db } from '../db.js';
import { createUserForDoctor} from "../handlers/usersHandler.js";

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors WHERE doctor_id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a doctor
export const createDoctor = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { firstName, lastName, specialty, phone, email ,username,password} = req.body;

    const [result] = await db.query(
      `INSERT INTO doctors (first_name, last_name, specialty, phone, email, createdBy) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, specialty, phone, email, createdBy]
    );
    const doctorId = result.insertId;

    const userId = await createUserForDoctor({
      username,
      password,
      role: "Doctor",
      linkedDoctorId: doctorId
    });
    res.json({ doctorId: result.insertId });

  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a doctor
export const updateDoctor = async (req, res) => {
  try {
    const { firstName, lastName, specialty, phone, email } = req.body;
    await db.query(
      'UPDATE doctors SET first_name=?, last_name=?, specialty=?, phone=?, email=? WHERE doctorId=?',
      [firstName, lastName, specialty, phone, email, req.params.id]
    );
    res.json({ message: 'Doctor updated' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
  try {
    await db.query('DELETE FROM doctors WHERE doctor_id=?', [req.params.id]);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};