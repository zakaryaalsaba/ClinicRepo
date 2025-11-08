// handlers/billsHandler.js
import { db } from '../db.js';

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bills");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get a single bill by ID
export const getBillById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bills WHERE billId = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Bill not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new bill
export const createBill = async (req, res) => {
  try {
    if (!patientId || !amount) {
      return res.status(400).json({ message: "patientId and amount are required" });
    }
    
    const createdBy = req.user.userId;
    const { patientId, appointmentId, amount, insuranceCoveredAmount, discount, taxPercentage, status } = req.body;

    const [result] = await db.query(
      `INSERT INTO bills 
       (patientId, appointmentId, amount, insuranceCoveredAmount, discount, taxPercentage, status, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [patientId, appointmentId, amount, insuranceCoveredAmount, discount, taxPercentage, status, createdBy]
    );

    res.json({ billId: result.insertId });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a bill (status / paymentDate)
export const updateBill = async (req, res) => {
  try {
    const { status, paymentDate } = req.body;
    await db.query(
      "UPDATE bills SET status=?, paymentDate=? WHERE billId=?",
      [status, paymentDate, req.params.id]
    );
    res.json({ message: "Bill updated" });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};