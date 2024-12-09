// Import Express, controllers, and middleware
import express from "express"
import {
  signUpUser,
  signInUser,
  resetPasswordWithEmail,
  signout,
} from "../controllers/authController.js"

import { validateSignUpInput } from "../middlewares/signUpUserSchema.js"

const router = express.Router()

// Route for user sign-up
// Public route that creates a new user in Firebase Authentication
router.post("/signup", validateSignUpInput, signUpUser)

// Route for user sign-in
// Public route that generates a Firebase ID token for authenticated users
router.post("/signin", signInUser)

// Route for reset password
router.post("/resetpassword", resetPasswordWithEmail)

//Route for signing out
router.get("/signout", signout)

export default router
