
import os
import time
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2

# Import detection modules
from detection.fight_detector import FightDetector
from detection.drowsiness_detector import DrowsinessDetector
from detection.behavior_detector import BehaviorDetector
from detection.access_detector import AccessDetector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('hostel-security-ai')

app = Flask(__name__)
CORS(app)

# Initialize detection models
@app.before_first_request
def load_models():
    global fight_detector, drowsiness_detector, behavior_detector, access_detector
    
    logger.info("Loading ML models...")
    
    # Load models with error handling
    try:
        fight_detector = FightDetector()
        drowsiness_detector = DrowsinessDetector()
        behavior_detector = BehaviorDetector()
        access_detector = AccessDetector()
        logger.info("All models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise

# Routes for different detection types
@app.route('/api/detect/fight', methods=['POST'])
def detect_fight():
    try:
        # Get video frame from request
        file = request.files.get('frame')
        if not file:
            return jsonify({"error": "No frame provided"}), 400
            
        # Process image
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # Run detection
        results = fight_detector.detect(img)
        
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in fight detection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect/drowsiness', methods=['POST'])
def detect_drowsiness():
    try:
        # Get video frame from request
        file = request.files.get('frame')
        if not file:
            return jsonify({"error": "No frame provided"}), 400
            
        # Process image
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # Run detection
        results = drowsiness_detector.detect(img)
        
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in drowsiness detection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect/behavior', methods=['POST'])
def detect_behavior():
    try:
        # Get video frame from request
        file = request.files.get('frame')
        if not file:
            return jsonify({"error": "No frame provided"}), 400
            
        # Process image
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # Run detection
        results = behavior_detector.detect(img)
        
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in behavior detection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect/access', methods=['POST'])
def detect_access():
    try:
        # Get video frame from request
        file = request.files.get('frame')
        if not file:
            return jsonify({"error": "No frame provided"}), 400
            
        # Process image
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # Run detection
        results = access_detector.detect(img)
        
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in access detection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "models_loaded": True})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
