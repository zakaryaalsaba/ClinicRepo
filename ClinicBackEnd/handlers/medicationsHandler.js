// handlers/medicationsHandler.js
import { db } from '../db.js';

// Get all medications
export const getAllMedications = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM medicationsOrders");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMedicationById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM medicationsOrders WHERE medicationId=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Medication not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching medication:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new medication order
export const createMedication = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { appointmentId, patientId, doctorId, drug_name, dosage, frequency, duration, notes } = req.body;

    const [result] = await db.query(
      `INSERT INTO medicationsOrders
       (appointmentId, patientId, doctorId, drug_name, dosage, frequency, duration, notes, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, patientId, doctorId, drug_name, dosage, frequency, duration, notes, createdBy]
    );

    res.json({ medicationId: result.insertId });
  } catch (error) {
    console.error("Error creating medication:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update a medication
export const updateMedication = async (req, res) => {
  try {
    const { drug_name, dosage, frequency, duration, notes } = req.body;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (drug_name) {
      fields.push("drug_name = ?");
      values.push(drug_name);
    }
    if (dosage) {
      fields.push("dosage = ?");
      values.push(dosage);
    }
    if (frequency) {
      fields.push("frequency = ?");
      values.push(frequency);
    }
    if (duration) {
      fields.push("duration = ?");
      values.push(duration);
    }
    if (notes) {
      fields.push("notes = ?");
      values.push(notes);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(req.params.id); // for WHERE clause

    const query = `UPDATE medicationsOrders SET ${fields.join(", ")} WHERE medicationId = ?`;

    await db.query(query, values);

    res.json({ message: "Medication updated" });
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a medication
export const deleteMedication = async (req, res) => {
  try {
    await db.query("DELETE FROM medicationsOrders WHERE medicationId=?", [req.params.id]);
    res.json({ message: "Medication deleted" });
  } catch (error) {
    console.error("Error deleting medication:", error);
    res.status(500).json({ message: "Server error" });
  }
};
