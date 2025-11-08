import { db } from '../db.js';

// Get all insurance providers
export const getAllProviders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM insuranceProviders");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get provider by ID
export const getProviderById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM insuranceProviders WHERE providerId=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Provider not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new provider
export const createProvider = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { name, contact_phone, contact_email } = req.body;

    const [result] = await db.query(
      "INSERT INTO insuranceProviders (name, contact_phone, contact_email, createdBy) VALUES (?,?,?,?)",
      [name, contact_phone, contact_email, createdBy]
    );

    res.json({ providerId: result.insertId });
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update provider
export const updateProvider = async (req, res) => {
  try {
    const { name, contact_phone, contact_email } = req.body;
    await db.query(
      "UPDATE insuranceProviders SET name=?, contact_phone=?, contact_email=? WHERE providerId=?",
      [name, contact_phone, contact_email, req.params.id]
    );
    res.json({ message: "Provider updated" });
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete provider
export const deleteProvider = async (req, res) => {
  try {
    await db.query("DELETE FROM insuranceProviders WHERE providerId=?", [req.params.id]);
    res.json({ message: "Provider deleted" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};