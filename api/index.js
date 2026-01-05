const express = require("express")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Local test OK" })
})

app.listen(3000, () => {
  console.log("Running on http://localhost:3000")
})
