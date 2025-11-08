import { db } from "../db.js";

// Get all patient insurance records
export const getAllPatientInsurance = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patientInsurance");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching patient insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single patient insurance by ID
export const getAllPatientInsuranceById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM patientInsurance WHERE patientInsuranceId=?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Patient insurance not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching patient insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new patient insurance record
export const createPatientInsurance = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { patientId, providerId, policy_number, coverage_details, startDate, endDate } = req.body;

    const [result] = await db.query(
      `INSERT INTO patientInsurance
       (patientId, providerId, policy_number, coverage_details, startDate, endDate, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patientId, providerId, policy_number, coverage_details, startDate, endDate, createdBy]
    );

    res.json({ patientInsuranceId: result.insertId });
  } catch (error) {
    console.error("Error creating patient insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update patient insurance
export const updatePatientInsurance = async (req, res) => {
  try {
    const { patientId, providerId, policy_number, coverage_details, startDate, endDate, active } = req.body;

    const [result] = await db.query(
      `UPDATE patientInsurance 
       SET patientId=?, providerId=?, policy_number=?, coverage_details=?, startDate=?, endDate=?, active=?
       WHERE patientInsuranceId=?`,
      [patientId, providerId, policy_number, coverage_details, startDate, endDate, active, req.params.id]
    );

    res.json({ message: "Patient insurance updated" });
  } catch (error) {
    console.error("Error updating patient insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete patient insurance
export const deletePatientInsurance = async (req, res) => {
  try {
    await db.query("DELETE FROM patientInsurance WHERE patientInsuranceId=?", [req.params.id]);
    res.json({ message: "Patient insurance deleted" });
  } catch (error) {
    console.error("Error deleting patient insurance:", error);
    res.status(500).json({ message: "Server error" });
  }
};