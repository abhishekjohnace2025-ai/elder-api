import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  const { resources } = await cloudinary.search
    .expression("folder:elder-api")
    .sort_by("created_at", "desc")
    .max_results(20)
    .execute()

  res.json(resources.map(img => ({
    url: img.secure_url,
    id: img.public_id,
  })))
}
