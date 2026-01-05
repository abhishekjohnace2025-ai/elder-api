import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" })
    }

    try {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "elder-api" }
      )

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      })
    } catch (error) {
      return res.status(500).json({
        error: "Cloudinary upload failed",
        details: error.message,
      })
    }
  })
}
