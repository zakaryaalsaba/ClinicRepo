import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req,res)=>{
  const { username, password, role, linked_doctor_id } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query('INSERT INTO users (username,password_hash,role,linked_doctor_id) VALUES (?,?,?,?)',
    [username, hash, role, linked_doctor_id || null]);
  res.json({ user_id: result.insertId });
});

// Login
router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE username=?',[username]);
  if(rows.length === 0) return res.status(404).json({ message:'User not found' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if(!match) return res.status(401).json({ message:'Invalid password' });

  const token = jwt.sign({ user_id:user.user_id, role:user.role, linked_doctor_id:user.linked_doctor_id },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token });
});

export default router;