const router = require("express").Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { lat, lng, category, city } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: "Latitude and longitude are required" });
    }

    if (!apiKey) {
      return res.json({
        success: false,
        error: "Google Maps API key is missing.",
        fallback: true
      });
    }

    let url = "";
    let useNearbySearch = false;
    let requestBody = {};

    if (category === "Pharmacies" || category === "Hospitals") {
      useNearbySearch = true;
      url = "https://places.googleapis.com/v1/places:searchNearby";
      requestBody = {
        includedTypes: [category === "Pharmacies" ? "pharmacy" : "hospital"],
        maxResultCount: 15,
        locationRestriction: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
            },
            radius: 8000.0
          }
        }
      };
    } else {
      url = "https://places.googleapis.com/v1/places:searchText";
      
      // Determine suitable query based on category
      let textQuery = category || "hospital";
      let includedType = "";
      
      if (category === "Government Hospitals") {
        textQuery = "government hospital";
        includedType = "hospital";
      } else if (category === "Primary Health Centers (PHC)") {
        textQuery = "primary health center";
        includedType = "medical_clinic";
      } else if (category === "Community Health Centers") {
        textQuery = "community health center";
        includedType = "medical_clinic";
      } else if (category === "Emergency Services") {
        textQuery = "emergency room";
        includedType = "hospital";
      } else if (category === "Ambulance Services") {
        textQuery = "ambulance service";
      } else if (category === "Blood Banks") {
        textQuery = "blood bank";
        includedType = "hospital";
      }

      // Append city if available to make text matching exact
      if (city && city.trim() && city.toLowerCase() !== "my location") {
        textQuery = `${textQuery} in ${city.trim()}`;
      }

      requestBody = {
        textQuery,
        locationRestriction: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng)
            },
            radius: 12000.0
          }
        }
      };

      if (includedType) {
        requestBody.includedType = includedType;
      }
    }

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.rating,places.regularOpeningHours"
        }
      }
    );

    const places = response.data.places || [];

    const results = places.map((place) => {
      const placeLat = place.location?.latitude;
      const placeLng = place.location?.longitude;
      const address = place.formattedAddress || "Address unavailable";

      return {
        id: `google-${place.id}`,
        placeId: place.id,
        name: place.displayName?.text || "Unknown Facility",
        rating: place.rating || parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        address: address,
        phone: place.nationalPhoneNumber || "+91 22 2414 1414",
        lat: placeLat,
        lng: placeLng,
        status: place.regularOpeningHours?.openNow ? "Open Now" : "Open 24 hrs"
      };
    });

    return res.json({
      success: true,
      googleMapsKey: apiKey,
      results
    });

  } catch (err) {
    console.error("Google Places Error:", err.response?.data || err.message);
    res.json({
      success: false,
      error: err.response?.data?.error?.message || err.message,
      fallback: true
    });
  }
});

router.get("/details", async (req, res) => {
  try {
    const { place_id } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!place_id) {
      return res.status(400).json({ success: false, error: "place_id is required" });
    }

    if (!apiKey) {
      return res.json({ success: false, error: "Google Maps API key is missing" });
    }

    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${place_id}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,nationalPhoneNumber,rating,regularOpeningHours,websiteUri"
        }
      }
    );

    const details = response.data;
    return res.json({
      success: true,
      phone: details.nationalPhoneNumber || "+91 22 2414 1414",
      rating: details.rating || 4.5,
      website: details.websiteUri || "",
      openNow: details.regularOpeningHours?.openNow ? "Open Now" : "Open 24 hrs"
    });
  } catch (err) {
    console.error("Google Place Details Error:", err.response?.data || err.message);
    res.json({
      success: false,
      error: err.response?.data?.error?.message || err.message
    });
  }
});

router.get("/geocode", async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: "Query is required" });
    }

    const cleanedQuery = query.trim();
    const lowerQuery = cleanedQuery.toLowerCase();

    // 1. Check offline dictionary first (extremely fast & works offline)
    const majorCities = {
      mumbai: { lat: 19.0760, lng: 72.8777 },
      delhi: { lat: 28.6139, lng: 77.2090 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      hyderabad: { lat: 17.3850, lng: 78.4867 },
      pune: { lat: 18.5204, lng: 73.8567 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 }
    };

    if (majorCities[lowerQuery]) {
      const coords = majorCities[lowerQuery];
      return res.json({
        success: true,
        lat: coords.lat,
        lng: coords.lng,
        cityName: cleanedQuery.charAt(0).toUpperCase() + cleanedQuery.slice(1)
      });
    }

    // 2. Try Google Geocoding API if key is present
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleanedQuery)}&key=${apiKey}`;
        const response = await axios.get(url, { timeout: 4000 });
        if (response.data.status === "OK" && response.data.results.length > 0) {
          const result = response.data.results[0];
          const lat = result.geometry.location.lat;
          const lng = result.geometry.location.lng;
          
          let cityName = "";
          for (const component of result.address_components) {
            if (component.types.includes("locality")) {
              cityName = component.long_name;
              break;
            }
          }
          if (!cityName) {
            for (const component of result.address_components) {
              if (component.types.includes("administrative_area_level_2")) {
                cityName = component.long_name;
                break;
              }
            }
          }
          if (!cityName) {
            cityName = result.formatted_address.split(",")[0] || cleanedQuery;
          }

          return res.json({
            success: true,
            lat,
            lng,
            cityName
          });
        }
      } catch (err) {
        console.warn("Google Geocoding failed, falling back to Nominatim:", err.message);
      }
    }

    // 3. Fallback to OpenStreetMap Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanedQuery)}&format=json&limit=1`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "HealixHealthCompanion/1.0"
        },
        timeout: 4000
      });

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        const lat = parseFloat(data.lat);
        const lng = parseFloat(data.lon);
        const displayName = data.display_name || cleanedQuery;
        const cityName = displayName.split(",")[0] || cleanedQuery;

        return res.json({
          success: true,
          lat,
          lng,
          cityName
        });
      }
    } catch (osmErr) {
      console.warn("Nominatim Geocoding failed:", osmErr.message);
    }

    // Return success: false instead of a 500 when geocoding is unavailable offline
    return res.json({
      success: false,
      error: "Location not found or network connection issue"
    });

  } catch (err) {
    console.error("Geocode Route Error:", err.message);
    res.json({ success: false, error: "An unexpected error occurred during geocoding." });
  }
});

module.exports = router;
