import express from "express";
import multer from "multer";
import processImage from "./utils/api_func.js";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage({}) });

app.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file found");
    const processedImageUrl = await processImage(req.file.buffer);

    return res.json({
      uploadedImage: `/uploadedImage.png`,
      processedImage: processedImageUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/download/:url", async (req, res) => {
  try {
    const url = req.params.url;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="chitransh-${Date.now()}-cowed.png"`
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error downloading the file");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
