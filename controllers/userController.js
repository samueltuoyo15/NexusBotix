import { db, authAdmin, storage } from "../firebase/firebaseAdmin.js"
import { checkPermission } from "../utils/checkPermission.js"

import multer from "multer"
import { v4 as uuidv4 } from "uuid"

const profile = async (req, res) => {
  try {
    const userId = req.params.id
    checkPermission(req.user, userId)
    const user = await db.collection("Users").doc(userId).get()
    if (!user.exists) {
      return res.status(404).json({ message: "User does not exist" })
    }

    res.status(200).json({ user: user.data() })
  } catch (error) {
    console.error("Error fetching user ", error)
    return res
      .status(500)
      .json({ message: `Failed to fecth user ${error.message}` })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const usersShapshot = db.collection("Users").get()
    const users = (await usersShapshot).docs.map((user) => ({
      id: user.id,
      ...user.data(),
    }))
    return res.status(200).json({ users })
  } catch (error) {
    console.error("Error getting users ", error)
    return res.status(500).json({ message: "Error getting users" })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(500).json({ message: "Please provide a new name" })
    }
    const userId = req.user.uid

    const userRef = db.collection("Users").doc(userId)

    await userRef.update({ name })
    res.status(200).json({ message: "User updated " })
  } catch (error) {
    console.error("Error updating user ", error)
    res.status(500).json({ message: "Error updating user " })
  }
}

const changePassword = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ message: "Please provide a new password" })
    }
    const userId = req.user.uid
    await authAdmin.updateUser(userId, { password })
    res.status(200).json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error changing password ", error)
    res.status(500).json({ message: "failed to change password" })
  }
}
// Setup multer to handle image upload (using memoryStorage for simplicity)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false)
    }
    cb(null, true)
  },
}).single("profilePicture")

const setProfilePicture = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for multer or other errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` })
    } else if (err) {
      return res.status(400).json({ error: err.message })
    }
    // Check if file is present in the request body
    if (!req.file) {
      return res.status(400).json({ message: "Please pass in an image" })
    }

    const userId = req.user.uid // Assuming user info is available
    try {
      // Create a unique file name using UUID
      const fileName = `profile-pictures/${userId}-${uuidv4()}${
        req.file.originalname
      }`
      const file = storage.file(fileName)

      // Upload file to Firebase Storage
      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        public: true,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      })

      // Get the image URL from Firebase Storage
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        storage.name
      }/o/${encodeURIComponent(fileName)}?alt=media&token=${
        file.metadata.metadata.firebaseStorageDownloadTokens
      }`

      // Update Firestore with the image URL
      await db.collection("Users").doc(userId).update({
        imageUrl: imageUrl,
      })

      res.status(200).json({
        message: "Profile picture has been set",
        imageUrl: imageUrl,
      })
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message })
    }
  })
}

export {
  profile,
  updateProfile,
  changePassword,
  getAllUsers,
  setProfilePicture,
}
