const express = require("express")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const healthRecordRoutes = require("./routes/healthRecordRoutes")
const medicationReminderRoutes = require("./routes/medicationReminderRoutes")
const hospitalRoutes = require("./routes/hospitalRoutes")
const doctorConsultationRoutes = require("./routes/doctorConsultationRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/health-records", healthRecordRoutes)
app.use("/api/medication-reminders", medicationReminderRoutes)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/consultations", doctorConsultationRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to MediTrack API" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

module.exports = app

