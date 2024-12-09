import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "../firebase/firebaseClient.js" // Correct import

import { db, authAdmin } from "../firebase/firebaseAdmin.js"

// Controller to sign up a new user
const signUpUser = async (req, res) => {
  const { email, password, name } = req.body // Extract email and password from request body
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ message: "Email, password, and name are required." })
  }
  try {
    // Create a new user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    const authID = userCredential.user.uid
    // send email verification link to user email
    try {
      await sendEmailVerification(userCredential.user)
    } catch (verificationError) {
      console.log(verificationError)
      return res.status(500).json({
        message: verificationError.message,
      })
    }
    // create a object containing the user details that will be saved
    const userDetails = {
      email,
      name,
      role: "free",
      createdAt: new Date(),
      lastLogin: new Date(),
      imageUrl: "",
    }

    const userRef = db.collection("Users").doc(authID)
    await userRef.set(userDetails)

    // creating custom claims
    await authAdmin.setCustomUserClaims(authID, { role: "free" })

    res.status(201).json({
      message:
        "Verification email has been sent. User created successfully. Please verify your email",
      userDetails,
    })
  } catch (error) {
    console.error("Error signing up user:", error)
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message })
  }
}

// Controller to sign in an existing user
const signInUser = async (req, res) => {
  const { email, password } = req.body // Extract email and password from request body
  if (!email || !password) {
    return res.status(422).json({ message: "Email and password are required." })
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    ) // Sign in user

    // check if the user email has been verified
    if (!userCredential.user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email",
      })
    }

    const token = await userCredential.user.getIdToken(true) // Generate ID token
    const decodedToken = await authAdmin.verifyIdToken(token)
    const customClaims = decodedToken.role

    console.log(customClaims)
    console.log(decodedToken)

    res.status(200).json({
      message: "User signed in successfully",
      token,
    })
  } catch (error) {
    console.error("Error signing in user:", error)
    res
      .status(500)
      .json({ message: "Failed to sign in user", error: error.message })
  }
}

//forgot password and reset password link sent to email
const resetPasswordWithEmail = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(422).json({
        message: "Email is required",
      })
    }
    await sendPasswordResetEmail(auth, email)
    res.status(200).json({
      message: "Password reset email has been sent ",
    })
  } catch (error) {
    console.error("Error sending password reset email:", error)
    res.status(500).json({
      message: "Failed to send password reset email",
      error: error.message,
    })
  }
}

// sign out controller
const signout = async (req, res) => {
  try {
    await signOut(auth)
    res.status(200).json({ message: "User logged out successfully" })
  } catch (error) {
    console.error("Error signing out:", error)
    res.status(500).json({
      message: "Failed to sign out",
      error: error.message,
    })
  }
}

export { signUpUser, signInUser, resetPasswordWithEmail, signout }
