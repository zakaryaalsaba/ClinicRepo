// handlers/radiologyImagesHandler.js
import { db } from "../db.js";

// Get all radiology images
export const getAllRadiologyImages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM radiologyImages");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching radiology images:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single radiology image by ID
export const getRadiologyImageById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM radiologyImages WHERE imageId = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Radiology image not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching radiology image:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Create a new radiology image record
export const createRadiologyImage = async (req, res) => {
  try {
    const createdBy = req.user.userId;
    const { appointmentId, patientId, doctorId, imageType, description, file_path } = req.body;

    const [result] = await db.query(
      `INSERT INTO radiologyImages
       (appointmentId, patientId, doctorId, imageType, description, file_path, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, patientId, doctorId, imageType, description, file_path, createdBy]
    );

    res.json({ imageId: result.insertId });
  } catch (error) {
    console.error("Error creating radiology image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update radiology image status
export const updateRadiologyImageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE radiologyImages SET status=? WHERE imageId=?", [status, req.params.id]);
    res.json({ message: "Radiology image updated" });
  } catch (error) {
    console.error("Error updating radiology image:", error);
    res.status(500).json({ message: "Server error" });
  }
};