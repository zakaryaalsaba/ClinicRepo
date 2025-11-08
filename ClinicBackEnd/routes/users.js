// routes/users.js
import express from "express";
//import { authenticateToken } from "../middleware/auth.js";
//import { authorizeRole } from "../middleware/authorizeRole.js";
import { getAllUsers, createUser, deleteUser,updateUser ,login} from "../handlers/usersHandler.js";

const router = express.Router();

//router.use(authenticateToken);

// ✅ Admin only routes
// router.get("/", authorizeRole(["Admin"]), getAllUsers);
// router.post("/", authorizeRole(["Admin"]), createUser);
// router.delete("/:id", authorizeRole(["Admin"]), deleteUser);

router.get("/", getAllUsers);
router.post("/login", login);
router.post("/",  createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;