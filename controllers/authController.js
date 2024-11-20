import { auth } from '../firebase/firebaseClient.js'; // Correct import

// Controller to sign up a new user
const signUpUser = async (req, res) => {
    const { email, password } = req.body; // Extract email and password from request body

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password); // Create a new user
        res.status(201).json({ 
            message: 'User created successfully', 
            uid: userCredential.user.uid 
        });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

// Controller to sign in an existing user
const signInUser = async (req, res) => {
    const { email, password } = req.body; // Extract email and password from request body

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password); // Sign in user
        const token = await userCredential.user.getIdToken(); // Generate ID token
        res.status(200).json({ 
            message: 'User signed in successfully', 
            token 
        });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ message: 'Failed to sign in user', error: error.message });
    }
};

export { signUpUser, signInUser };
