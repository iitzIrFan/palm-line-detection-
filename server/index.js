const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ROBOFLOW_API_URL = "https://detect.roboflow.com/palm-line-segmentation/1";
const ROBOFLOW_API_KEY = "EVjzzLyg8RgZjNgmDU17";

const lineDescriptions = {
  heart_line: "Represents emotions & relationships. A clear, deep line indicates strong emotional connections and passionate nature.",
  head_line: "Indicates intellect & decision-making. The length and curve suggest analytical abilities and creativity.",
  life_line: "Relates to health & vitality. A strong life line indicates robust health and high energy levels.",
  fate_line: "Reflects career path & destiny. This line shows your life's direction and career success potential.",
  sun_line: "Represents fame and creativity. A prominent sun line suggests artistic talents and potential recognition."
};

const fingertipDescriptions = {
  thumb: "The thumb represents willpower and logic. A strong thumb indicates leadership qualities.",
  index: "The index finger represents ambition and leadership. It shows your desire for power and recognition.",
  middle: "The middle finger represents responsibility and balance. It indicates your approach to duty and structure.",
  ring: "The ring finger represents creativity and emotions. It shows artistic abilities and romantic nature.",
  pinky: "The pinky finger represents communication and intuition. It indicates social skills and business acumen."
};

// Helper function to detect fingertips based on palm lines
function detectFingertips(predictions, imageWidth = 640, imageHeight = 480) {
  // Simulate fingertip detection based on palm line positions
  // In a real implementation, you'd use TensorFlow.js HandPose model
  const fingertips = [];
  
  if (predictions.length > 0) {
    // Calculate approximate fingertip positions based on palm area
    const palmCenter = {
      x: predictions.reduce((sum, p) => sum + p.x, 0) / predictions.length,
      y: predictions.reduce((sum, p) => sum + p.y, 0) / predictions.length
    };
    
    // Simulate 5 fingertip positions around the palm
    const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    const angles = [-60, -30, 0, 30, 60]; // degrees from vertical
    
    fingerNames.forEach((name, idx) => {
      const angle = (angles[idx] * Math.PI) / 180;
      const distance = 80 + (Math.random() * 40); // Random distance from palm center
      
      fingertips.push({
        name,
        x: palmCenter.x + Math.sin(angle) * distance,
        y: palmCenter.y - Math.abs(Math.cos(angle)) * distance,
        confidence: 0.8 + Math.random() * 0.2,
        description: fingertipDescriptions[name] || "Fingertip detected"
      });
    });
  }
  
  return fingertips;
}

// Generate comprehensive palm analysis
function generatePalmAnalysis(lines, fingertips) {
  const analysis = {
    personality: "",
    strengths: [],
    challenges: [],
    starseed: "",
    overall: ""
  };
  
  // Analyze based on detected lines
  const lineTypes = lines.map(l => l.class);
  
  if (lineTypes.includes('heart_line')) {
    analysis.personality += "You are emotionally expressive and value deep connections. ";
    analysis.strengths.push("Strong emotional intelligence");
  }
  
  if (lineTypes.includes('head_line')) {
    analysis.personality += "You possess analytical thinking and make decisions carefully. ";
    analysis.strengths.push("Excellent problem-solving abilities");
  }
  
  if (lineTypes.includes('life_line')) {
    analysis.personality += "You have strong vitality and a zest for life. ";
    analysis.strengths.push("Natural resilience and energy");
  }
  
  if (lineTypes.includes('fate_line')) {
    analysis.personality += "Your life path is clearly defined with strong career focus. ";
    analysis.strengths.push("Natural leadership qualities");
  }
  
  if (lineTypes.includes('sun_line')) {
    analysis.personality += "You have creative talents and potential for recognition. ";
    analysis.strengths.push("Artistic and creative abilities");
  }
  
  // Generate starseed reading based on fingertip positions
  const fingertipNames = fingertips.map(f => f.name);
  if (fingertipNames.length >= 4) {
    analysis.starseed = "Your cosmic origins trace to the Pleiadian star system. You are a natural healer and lightworker, drawn to helping others awaken to their spiritual potential. Your soul mission involves bringing harmony and elevated consciousness to Earth.";
  } else {
    analysis.starseed = "Your soul carries ancient wisdom from the Sirian star system. You are here to share knowledge and guide others through transformation. Your mission involves bridging spiritual and practical wisdom.";
  }
  
  // Overall analysis
  analysis.overall = `Based on your palm reading, you possess ${analysis.strengths.length} key strengths. ${analysis.personality} Your spiritual path is aligned with your earthly purpose, making you a powerful agent of positive change.`;
  
  return analysis;
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ success: false, message: "No image provided" });

    // Validate image format
    if (!image.includes('base64,')) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

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

    // Process palm lines
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
        confidence: p.confidence,
        description: lineDescriptions[p.class] || "Unknown line.",
      };
    });

    // Detect fingertips
    const fingertips = detectFingertips(predictions);
    
    // Generate comprehensive analysis
    const analysis = generatePalmAnalysis(lines, fingertips);

    res.json({ 
      success: true, 
      lines,
      fingertips,
      analysis,
      insights: analysis // Backward compatibility
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log("✅ Backend running at http://localhost:3001"));
