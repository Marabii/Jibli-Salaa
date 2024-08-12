const router = require("express").Router();
const Traveler = require("../models/travelers");
// const User = require("../models/users");
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
  console.log("req.body---------------------------------", req.body);
  try {
    const traveler = await Traveler.findOne({ userId: userId });
    if (traveler) {
      traveler.spokenLanguages = spokenLanguages;
      traveler.trips.push({
        departureCity: start,
        destinationCity: destination,
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        travelDetails: {
          isInternational: isInternational,
          areTaxesIncluded: areTaxesIncluded,
        },
      });
      await traveler.save();
    } else {
      const newTraveler = new Traveler({
        userId: userId,
        spokenLanguages: spokenLanguages,
        trips: [
          {
            departureCity: start,
            destinationCity: destination,
            departureDate: departureDate,
            arrivalDate: arrivalDate,
            travelDetails: {
              isInternational: isInternational,
              areTaxesIncluded: areTaxesIncluded,
            },
          },
        ],
      });
      await newTraveler.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
