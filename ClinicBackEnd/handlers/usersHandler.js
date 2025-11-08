// // // handlers/usersHandler.js
// // import { db } from "../db.js";

// // // Get all users (Admin only)
// // export const getAllUsers = async (req, res) => {
// //   try {
// //     const [rows] = await db.query("SELECT * FROM users");
// //     res.json(rows);
// //   } catch (error) {
// //     console.error("Error fetching users:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // Create a new user (Admin only)
// // export const createUser = async (req, res) => {
// //   try {
// //     const { username, password_hash, role, linkedDoctorId } = req.body;

// //     const [result] = await db.query(
// //       `INSERT INTO users (username, password_hash, role, linkedDoctorId)
// //        VALUES (?, ?, ?, ?)`,
// //       [username, password_hash, role, linkedDoctorId]
// //     );

// //     res.json({ userId: result.insertId });
// //   } catch (error) {
// //     console.error("Error creating user:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // Delete a user (Admin only)
// // export const deleteUser = async (req, res) => {
// //   try {
// //     await db.query("DELETE FROM users WHERE userId=?", [req.params.id]);
// //     res.json({ message: "User deleted" });
// //   } catch (error) {
// //     console.error("Error deleting user:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// handlers/usersHandler.js
import { db } from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
      const [rows] = await db.query('SELECT * FROM users WHERE username=?',[username]);
      if(rows.length === 0) return res.status(404).json({ message:'User not found' });
    
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if(!match) return res.status(401).json({ message:'Invalid password' });
    
      const token = jwt.sign({ userId:user.userId, role:user.role, linkedDoctorId:user.linkedDoctorId },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.json({ token });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const createUserForDoctor = async ({ username, password, role, linkedDoctorId }) => {
  try {
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (username, password_hash, role, linkedDoctorId)
       VALUES (?, ?, ?, ?)`,
      [username, password_hash, role, linkedDoctorId]
    );

    return result.insertId; // return the userId
  } catch (error) {
    console.error("Error creating user for doctor:", error);
    throw error;
  }
};
// Create a new user
export const createUser = async (req, res) => {
  try {
    console.error("createUser called");
    const { username, password, role, linkedDoctorId } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (username, password_hash, role, linkedDoctorId)
       VALUES (?, ?, ?, ?)`,
      [username, password_hash, role, linkedDoctorId]
    );

    res.json({ userId: result.insertId });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, role, linkedDoctorId } = req.body;

    // Build dynamic query
    const fields = [];
    const values = [];

    if (username) {
      fields.push("username = ?");
      values.push(username);
    }

    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      values.push(password_hash);
    }

    if (role) {
      fields.push("role = ?");
      values.push(role);
    }

    if (linkedDoctorId !== undefined) { // allow null
      fields.push("linkedDoctorId = ?");
      values.push(linkedDoctorId);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId); // for WHERE clause

    const query = `UPDATE users SET ${fields.join(", ")} WHERE userId = ?`;

    await db.query(query, values);

    res.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE userId=?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};