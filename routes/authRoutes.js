// Import Express, controllers, and middleware
import express from "express"
import {
  signUpUser,
  signInUser,
  googleSignUpAndSignIn,
  resetPasswordWithEmail,
  signout,
} from "../controllers/authController.js"
import verifyFirebaseToken from "../middlewares/authMiddleware.js"

const router = express.Router()

// Route for user sign-up
// Public route that creates a new user in Firebase Authentication
router.post("/signup", signUpUser)

// Route for user sign-in
// Public route that generates a Firebase ID token for authenticated users
router.post("/signin", signInUser)

//Route for user signup/ signin using google
router.post("/google", googleSignUpAndSignIn)

// Route for reset password
router.post("/resetpassword", resetPasswordWithEmail)

//Route for signing out
router.get("/signout", signout)
// Example of a protected route
// Requires a valid Firebase token to access
router.get("/profile", verifyFirebaseToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile",
    user: req.user,
  })
})

export default router
