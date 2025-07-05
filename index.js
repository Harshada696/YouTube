const express = require("express");
const cors = require("cors");
const { uploadVideo } = require("./routes/video");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/upload", uploadVideo);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
