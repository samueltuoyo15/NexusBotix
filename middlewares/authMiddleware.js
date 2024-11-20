// Import Firebase Admin Auth for verifying tokens
import { authAdmin } from '../firebase/firebaseAdmin.js';

// Middleware to verify Firebase ID tokens
// Ensures the user is authenticated before accessing protected routes
const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(token); // Verify the token
        req.user = decodedToken; // Attach decoded token to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default verifyFirebaseToken;
