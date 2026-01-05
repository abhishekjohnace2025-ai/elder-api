import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({ storage: multer.memoryStorage() })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req, res) {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message })

    try {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "elder-api" }
      )

      res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}
