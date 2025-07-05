const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const file = req.file.path;

    const uploadResult = await cloudinary.uploader.upload(file, {
      resource_type: "video",
      folder: "user_uploads",
    });

    const videoRef = await addDoc(collection(db, "videos"), {
      title: req.body.title,
      url: uploadResult.secure_url,
      uploadedBy: req.body.userEmail,
      timestamp: new Date(),
    });

    res.status(200).json({ success: true, videoUrl: uploadResult.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = { uploadVideo: router };
