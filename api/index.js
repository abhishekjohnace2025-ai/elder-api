export default function handler(req, res) {
  res.status(200).json({
    message: "Node API running on Vercel 🚀",
    method: req.method,
  })
}
