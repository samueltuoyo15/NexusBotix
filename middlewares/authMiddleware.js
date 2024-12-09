// Import Firebase Admin Auth for verifying tokens
import { authAdmin } from "../firebase/firebaseAdmin.js"

// Middleware to verify Firebase ID tokens
// Ensures the user is authenticated before accessing protected routes
const authenticateUser = async (req, res, next) => {
  let token
  // Extract token from the Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]
  }
  // check the cookies
  else if (req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" })
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(token) // Verify the token
    req.user = {
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    } // Attach decoded token to the request object
    next() // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying Firebase token:", error)
    return res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        message: "You are not authorised to access this route",
      })
    }
    next()
  }
}

export { authenticateUser, authorizeRoles }
