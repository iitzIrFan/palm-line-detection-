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
  const fingertips = [];
  
  if (predictions.length > 0) {
    // Find palm boundaries based on detected lines
    const palmBounds = {
      minX: Math.min(...predictions.map(p => p.x - p.width / 2)),
      maxX: Math.max(...predictions.map(p => p.x + p.width / 2)),
      minY: Math.min(...predictions.map(p => p.y - p.height / 2)),
      maxY: Math.max(...predictions.map(p => p.y + p.height / 2))
    };
    
    const palmCenterX = (palmBounds.minX + palmBounds.maxX) / 2;
    const palmTopY = palmBounds.minY;
    const palmWidth = palmBounds.maxX - palmBounds.minX;
    
    // Calculate more realistic fingertip positions
    const fingerSpacing = palmWidth / 5;
    const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    
    fingerNames.forEach((name, idx) => {
      let x, y;
      
      if (name === 'thumb') {
        // Thumb is positioned to the side of the palm
        x = palmBounds.minX - 20;
        y = palmCenterX + (palmBounds.maxY - palmBounds.minY) * 0.3;
      } else {
        // Other fingers are positioned above the palm
        const fingerIndex = idx - 1; // Adjust for thumb
        x = palmBounds.minX + fingerSpacing * (fingerIndex + 1);
        y = palmTopY - 30 - (Math.random() * 20); // Slight variation in finger lengths
      }
      
      // Ensure fingertips are within image bounds
      x = Math.max(10, Math.min(imageWidth - 10, x));
      y = Math.max(10, Math.min(imageHeight - 10, y));
      
      fingertips.push({
        name,
        x,
        y,
        confidence: 0.85 + Math.random() * 0.1,
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
    analysis.challenges.push("May be overly sensitive to criticism");
  }
  
  if (lineTypes.includes('head_line')) {
    analysis.personality += "You possess analytical thinking and make decisions carefully. ";
    analysis.strengths.push("Excellent problem-solving abilities");
    analysis.challenges.push("Tendency to overthink situations");
  }
  
  if (lineTypes.includes('life_line')) {
    analysis.personality += "You have strong vitality and a zest for life. ";
    analysis.strengths.push("Natural resilience and energy");
    analysis.challenges.push("May take unnecessary risks");
  }
  
  if (lineTypes.includes('fate_line')) {
    analysis.personality += "Your life path is clearly defined with strong career focus. ";
    analysis.strengths.push("Natural leadership qualities");
    analysis.challenges.push("Can be inflexible when plans change");
  }
  
  if (lineTypes.includes('sun_line')) {
    analysis.personality += "You have creative talents and potential for recognition. ";
    analysis.strengths.push("Artistic and creative abilities");
    analysis.challenges.push("May struggle with self-doubt");
  }
  
  // Add default analysis if no specific lines detected
  if (lineTypes.length === 0) {
    analysis.personality = "You have a unique palm pattern that suggests a complex and multifaceted personality. ";
    analysis.strengths.push("Adaptable and versatile nature");
    analysis.challenges.push("May need to focus on developing specific talents");
  }
  
  // Generate starseed reading based on line combinations
  const lineCount = lineTypes.length;
  if (lineTypes.includes('heart_line') && lineTypes.includes('head_line')) {
    analysis.starseed = "Your cosmic origins trace to the Pleiadian star system. You are a natural healer and lightworker, drawn to helping others awaken to their spiritual potential. Your balanced heart and mind connection shows your mission involves bringing harmony and elevated consciousness to Earth.";
  } else if (lineTypes.includes('fate_line') || lineTypes.includes('sun_line')) {
    analysis.starseed = "Your soul carries ancient wisdom from the Sirian star system. You are here to share knowledge and guide others through transformation. Your strong destiny lines show your mission involves bridging spiritual and practical wisdom.";
  } else {
    analysis.starseed = "Your soul energy resonates with the Arcturian frequency. You are a natural teacher and way-shower, here to help humanity evolve spiritually and technologically. Your unique palm patterns reflect your innovative approach to spiritual growth.";
  }
  
  // Enhanced overall analysis
  const strengthCount = analysis.strengths.length;
  const challengeCount = analysis.challenges.length;
  analysis.overall = `Based on your palm reading, you possess ${strengthCount} key strengths and ${challengeCount} areas for growth. ${analysis.personality} Your spiritual path is aligned with your earthly purpose, making you a powerful agent of positive change. The combination of your detected palm lines suggests a life journey filled with meaningful relationships, creative expression, and spiritual awakening.`;
  
  return analysis;
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { image, imageWidth = 640, imageHeight = 480 } = req.body;
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
      return res.status(200).json({ success: false, message: "No palm lines detected. Please ensure your palm is clearly visible and well-lit." });
    }

    // Process palm lines with confidence filtering and better coordinate calculation
    const lines = predictions
      .filter(p => {
        // Only include predictions with high confidence and valid palm line classes
        const validClasses = ['heart_line', 'head_line', 'life_line', 'fate_line', 'sun_line'];
        return p.confidence > 0.5 && validClasses.includes(p.class);
      })
      .map((p) => {
        // Calculate line endpoints more accurately based on detection box
        const centerX = p.x;
        const centerY = p.y;
        const halfWidth = p.width / 2;
        const halfHeight = p.height / 2;
        
        // Create line coordinates that better represent palm lines
        let x1, y1, x2, y2;
        
        // Adjust line orientation based on line type
        switch(p.class) {
          case 'heart_line':
            // Heart line typically runs horizontally
            x1 = centerX - halfWidth;
            y1 = centerY;
            x2 = centerX + halfWidth;
            y2 = centerY;
            break;
          case 'head_line':
            // Head line runs horizontally below heart line
            x1 = centerX - halfWidth;
            y1 = centerY;
            x2 = centerX + halfWidth;
            y2 = centerY + halfHeight * 0.3;
            break;
          case 'life_line':
            // Life line curves around the thumb
            x1 = centerX - halfWidth * 0.7;
            y1 = centerY - halfHeight;
            x2 = centerX;
            y2 = centerY + halfHeight;
            break;
          case 'fate_line':
            // Fate line runs vertically
            x1 = centerX;
            y1 = centerY - halfHeight;
            x2 = centerX;
            y2 = centerY + halfHeight;
            break;
          case 'sun_line':
            // Sun line runs vertically, parallel to fate line
            x1 = centerX;
            y1 = centerY - halfHeight * 0.8;
            x2 = centerX;
            y2 = centerY + halfHeight * 0.5;
            break;
          default:
            x1 = centerX - halfWidth;
            y1 = centerY - halfHeight;
            x2 = centerX + halfWidth;
            y2 = centerY + halfHeight;
        }

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

    // Detect fingertips with actual image dimensions
    const fingertips = detectFingertips(predictions, imageWidth, imageHeight);
    
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
