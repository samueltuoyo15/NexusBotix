import express from "express"
import {
  profile,
  updateProfile,
  getAllUsers,
  changePassword,
  setProfilePicture,
} from "../controllers/userController.js"

import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js"

const router = express.Router()

// user routes
router.get("/profile/:id", authenticateUser, profile)
router.patch("/update-profile", authenticateUser, updateProfile)
router.patch("/change-password", authenticateUser, changePassword)
router.patch("/profile-picture", authenticateUser, setProfilePicture)

// admin only routes
router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers)

export default router
