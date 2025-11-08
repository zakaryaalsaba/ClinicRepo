import { db } from '../db.js';

// Get all lab orders
export const getAllLabOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM labsOrders");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching lab orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get lab order by ID
export const getLabOrderById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM labsOrders WHERE labOrderId=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Lab order not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching lab order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new lab order
export const createLabOrder = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { appointmentId, patientId, doctorId, lab_name, test_details } = req.body;

    const [result] = await db.query(
      `INSERT INTO labsOrders
       (appointmentId, patientId, doctorId, lab_name, test_details, createdBy)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appointmentId, patientId, doctorId, lab_name, test_details, createdBy]
    );

    res.json({ labOrderId: result.insertId });
  } catch (error) {
    console.error("Error creating lab order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a lab order (status / results)
export const updateLabOrder = async (req, res) => {
  try {
    const { status, results } = req.body;

    await db.query(
      "UPDATE labsOrders SET status=?, results=? WHERE labOrderId=?",
      [status, JSON.stringify(results), req.params.id]
    );

    res.json({ message: "Lab order updated" });
  } catch (error) {
    console.error("Error updating lab order:", error);
    res.status(500).json({ message: "Server error" });
  }
};