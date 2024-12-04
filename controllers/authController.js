import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "../firebase/firebaseClient.js" // Correct import

// Controller to sign up a new user
const signUpUser = async (req, res) => {
  const { email, password } = req.body // Extract email and password from request body
  //TODO check if user is already registered before going ahead to register
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    ) // Create a new user
    res.status(201).json({
      message: "User created successfully",
      uid: userCredential.user.uid,
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

  try {
    //TODO check is user is registered
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    ) // Sign in user
    const token = await userCredential.user.getIdToken() // Generate ID token
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

//Controller to signup or signin with Google
const googleSignUpAndSignIn = async (req, res) => {
  try {
    // Sign in using redirect
    const provider = new GoogleAuthProvider()

    // Start a sign in process for an unauthenticated user.
    provider.addScope("profile")
    provider.addScope("email")
    await signInWithRedirect(auth, provider)
    // This will trigger a full page redirect away from your app

    // After returning from the redirect when your app initializes you can obtain the result
    const result = await getRedirectResult(auth)
    if (result) {
      // This is the signed-in user
      const user = result.user
      // This gives you a Google Access Token.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      res.status(200).json({
        user: user,
        token: token,
      })
    }
  } catch (error) {
    console.error("Error signing in user:", error)
    res.status(500).json({
      message: "Failed to sign in user with Google",
      error: error.message,
    })
  }
}

//forgot password and reset password link sent to email
const resetPasswordWithEmail = async (req, res) => {
  try {
    res.json({ message: "Reset" })
  } catch (error) {
    console.error("Error signing in user:", error)
    res.status(500).json({
      message: "Failed to sign in user with Google",
      error: error.message,
    })
  }
}

// sign out controller
const signout = async (req, res) => {
  try {
    await signOut(auth)
    res.redirect("http://localhost:5000/auth/signin")
  } catch (error) {
    console.error("Error signing out:", error)
    res.status(500).json({
      message: "Failed to sign out",
      error: error.message,
    })
  }
}

export {
  signUpUser,
  signInUser,
  googleSignUpAndSignIn,
  resetPasswordWithEmail,
  signout,
}
