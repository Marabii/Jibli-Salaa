const express = require("express");
const router = express.Router();
const Traveler = require("../models/travelers");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/api/createTraveler", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const {
    spokenLanguages,
    start,
    destination,
    departureDate,
    arrivalDate,
    isInternational,
    areTaxesIncluded,
  } = req.body;

  // Validate required fields
  if (!start || !destination || !departureDate || !arrivalDate) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    let traveler = await Traveler.findOne({ userId });

    const tripData = {
      departureCity: start,
      destinationCity: destination,
      departureDate,
      arrivalDate,
      travelDetails: {
        isInternational,
        areTaxesIncluded,
      },
    };

    if (traveler) {
      // Update existing traveler
      traveler.spokenLanguages = spokenLanguages || traveler.spokenLanguages;
      traveler.trips.push(tripData);
      await traveler.save();
    } else {
      // Create a new traveler
      const newTraveler = new Traveler({
        userId,
        spokenLanguages,
        trips: [tripData],
      });
      traveler = await newTraveler.save();
    }

    return res.status(200).json({ success: true, traveler });
  } catch (err) {
    console.error("Error creating/updating traveler:", err.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/api/getTraveler", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  try {
    const traveler = await Traveler.findOne({ userId });
    return res.status(200).json({ success: true, traveler });
  } catch (err) {
    console.error("Error getting traveler:", err.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
