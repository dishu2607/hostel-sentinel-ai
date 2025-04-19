
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import os
import time
from typing import Dict, Any, List, Tuple

class AccessDetector:
    """
    Unauthorized access detection model.
    
    This model detects unauthorized access by analyzing:
    1. Tailgating behavior (multiple people entering at once)
    2. Unfamiliar individuals 
    3. Unusual access patterns (time of day, frequency)
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the access detector.
        
        Args:
            model_path: Path to the TensorFlow model (optional)
        """
        # Load default model if not specified
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 
                                     "../models/access_detection/model.h5")
        
        # Initialize MediaPipe pose for person detection
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Load TensorFlow model if exists
        self.model = None
        if os.path.exists(model_path):
            self.model = tf.keras.models.load_model(model_path)
            print(f"Loaded access detection model from {model_path}")
        else:
            print(f"No model found at {model_path}, using rule-based detection")
            
        # Track people over time
        self.person_tracker = {}
        self.last_clean_time = time.time()
        self.persons_history = []
        self.max_history_len = 60  # About 2 seconds at 30fps
            
    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Detect unauthorized access in a video frame.
        
        Args:
            frame: RGB image as numpy array
            
        Returns:
            Dictionary with detection results:
            {
                "unauthorized_access": bool,
                "confidence": float,
                "access_type": str,
                "person_count": int,
                "details": Dict with access-specific metrics
            }
        """
        # Ensure RGB format
        if frame.shape[2] == 3 and frame[..., 0].mean() > frame[..., 2].mean():
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
        # Process with MediaPipe pose
        results = self.pose.process(frame)
        
        # Default result if no people detected
        if not results.pose_landmarks:
            return {
                "unauthorized_access": False,
                "confidence": 0.0,
                "access_type": "none",
                "person_count": 0,
                "details": {}
            }
            
        # Count people (simplified - in a real system we'd use a proper multi-person detector)
        # Here we're just using a single pose for demonstration
        person_count = 1 if results.pose_landmarks else 0
        
        # Update person history
        self.persons_history.append(person_count)
        if len(self.persons_history) > self.max_history_len:
            self.persons_history.pop(0)
            
        # Detect tailgating
        tailgating_score = self._detect_tailgating()
            
        # Get time-based access score
        time_based_score = self._time_based_access_score()
        
        # Determine access type
        access_type = "normal"
        if tailgating_score > 0.7:
            access_type = "tailgating"
        elif time_based_score > 0.7:
            access_type = "unusual_time"
            
        # If model exists, use it; otherwise use rule-based detection
        if self.model:
            # Prepare input features
            features = self._prepare_model_input(person_count, tailgating_score, time_based_score)
            
            # Get prediction
            prediction = self.model.predict(features, verbose=0)
            unauthorized_access = bool(prediction[0] > 0.6)
            confidence = float(prediction[0])
        else:
            # Use rule-based detection
            unauthorized_access, confidence = self._rule_based_detection(
                person_count, tailgating_score, time_based_score
            )
            
        return {
            "unauthorized_access": unauthorized_access,
            "confidence": confidence,
            "access_type": access_type,
            "person_count": person_count,
            "details": {
                "tailgating_score": float(tailgating_score),
                "time_based_score": float(time_based_score)
            }
        }
    
    def _detect_tailgating(self) -> float:
        """Detect tailgating behavior from person count history."""
        if len(self.persons_history) < 30:  # Need at least 1 second
            return 0.0
            
        # Check for sudden increase in person count
        recent_counts = self.persons_history[-10:]
        previous_counts = self.persons_history[-30:-10]
        
        avg_recent = sum(recent_counts) / len(recent_counts)
        avg_previous = sum(previous_counts) / len(previous_counts)
        
        # Sudden increase indicates potential tailgating
        increase = max(0, avg_recent - avg_previous)
        
        # Scale to [0, 1]
        tailgating_score = min(1.0, increase / 2.0)  # 2+ person increase is max score
        
        return tailgating_score
    
    def _time_based_access_score(self) -> float:
        """Calculate time-based access score."""
        # Get current hour (0-23)
        current_hour = time.localtime().tm_hour
        
        # Define normal hours (e.g., 8 AM to 10 PM)
        normal_start = 8
        normal_end = 22
        
        # Calculate time-based score
        if normal_start <= current_hour < normal_end:
            # During normal hours, low score
            return 0.1
        elif current_hour >= 22 or current_hour < 5:
            # Late night, high score
            return 0.8
        else:
            # Early morning, medium score
            return 0.5
        
    def _prepare_model_input(self, person_count: int, tailgating_score: float, time_score: float):
        """Prepare input features for the ML model."""
        features = np.array([[person_count, tailgating_score, time_score]])
        return features
        
    def _rule_based_detection(self, person_count: int, tailgating_score: float, time_score: float) -> Tuple[bool, float]:
        """Rule-based unauthorized access detection when no ML model is available."""
        # Combine scores with weights
        combined_score = 0.5 * tailgating_score + 0.3 * time_score
        
        # Additional factor for multiple people
        if person_count > 1:
            combined_score += 0.2
            
        # Determine if access is unauthorized
        unauthorized_access = combined_score > 0.6 or tailgating_score > 0.7
        
        return unauthorized_access, combined_score
