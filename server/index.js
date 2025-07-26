const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ROBOFLOW_API_URL = "https://detect.roboflow.com/palm-line-segmentation/1";
const ROBOFLOW_API_KEY = "EVjzzLyg8RgZjNgmDU17";

const lineDescriptions = {
  heart_line: "Represents emotions & relationships.",
  head_line: "Indicates intellect & decision-making.",
  life_line: "Relates to health & vitality.",
  fate_line: "Reflects career path & destiny.",
  sun_line: "Represents fame and creativity."
};

app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ success: false, message: "No image provided" });

    const base64Data = image.split(",")[1];

    const response = await axios.post(
      `${ROBOFLOW_API_URL}?api_key=${ROBOFLOW_API_KEY}`,
      base64Data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const predictions = response.data?.predictions || [];

    if (predictions.length === 0) {
      return res.status(200).json({ success: false, message: "No palm lines detected." });
    }

    const lines = predictions.map((p) => {
      const x1 = p.x - p.width / 2;
      const y1 = p.y - p.height / 2;
      const x2 = p.x + p.width / 2;
      const y2 = p.y + p.height / 2;

      return {
        class: p.class,
        x1,
        y1,
        x2,
        y2,
        description: lineDescriptions[p.class] || "Unknown line.",
      };
    });

    res.json({ success: true, lines });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log("✅ Backend running at http://localhost:3001"));
