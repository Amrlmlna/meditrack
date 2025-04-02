const express = require("express")
const router = express.Router()
const hospitalController = require("../controllers/hospitalController")
const { authenticate } = require("../middleware/authMiddleware")
const { validate, favoriteHospitalValidationRules } = require("../middleware/validationMiddleware")

// Add a hospital to favorites
router.post(
  "/favorites",
  authenticate,
  favoriteHospitalValidationRules,
  validate,
  hospitalController.addFavoriteHospital,
)

// Get all favorite hospitals for current user
router.get("/favorites", authenticate, hospitalController.getFavoriteHospitals)

// Get a specific favorite hospital
router.get("/favorites/:id", authenticate, hospitalController.getFavoriteHospitalById)

// Update a favorite hospital
router.put(
  "/favorites/:id",
  authenticate,
  favoriteHospitalValidationRules,
  validate,
  hospitalController.updateFavoriteHospital,
)

// Delete a favorite hospital
router.delete("/favorites/:id", authenticate, hospitalController.deleteFavoriteHospital)

// Search for nearby hospitals
router.get("/nearby", authenticate, hospitalController.searchNearbyHospitals)

module.exports = router

