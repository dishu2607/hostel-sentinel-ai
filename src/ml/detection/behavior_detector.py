
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import os
from typing import Dict, Any, List, Tuple

class BehaviorDetector:
    """
    Behavior anomaly detection model.
    
    This model detects unusual behaviors including:
    1. Loitering and suspicious movement patterns
    2. Potential alcohol consumption (unsteady gait, swaying)
    3. Unusual group interactions
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the behavior detector.
        
        Args:
            model_path: Path to the TensorFlow model (optional)
        """
        # Load default model if not specified
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 
                                     "../models/behavior_detection/model.h5")
        
        # Initialize MediaPipe pose and holistic
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.mp_holistic = mp.solutions.holistic
        self.holistic = self.mp_holistic.Holistic(
            static_image_mode=False,
            model_complexity=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Load TensorFlow model if exists
        self.model = None
        if os.path.exists(model_path):
            self.model = tf.keras.models.load_model(model_path)
            print(f"Loaded behavior detection model from {model_path}")
        else:
            print(f"No model found at {model_path}, using rule-based detection")
            
        # Tracking history for temporal analysis
        self.pose_history = []
        self.max_history_len = 30  # About 1 second at 30fps
        self.position_history = []
            
    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Detect unusual behaviors in a video frame.
        
        Args:
            frame: RGB image as numpy array
            
        Returns:
            Dictionary with detection results:
            {
                "unusual_behavior": bool,
                "confidence": float,
                "behavior_type": str,
                "details": Dict with behavior-specific metrics
            }
        """
        # Ensure RGB format
        if frame.shape[2] == 3 and frame[..., 0].mean() > frame[..., 2].mean():
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
        # Process with holistic model
        holistic_results = self.holistic.process(frame)
        
        # Default result if no people detected
        if not holistic_results.pose_landmarks:
            return {
                "unusual_behavior": False,
                "confidence": 0.0,
                "behavior_type": "none",
                "details": {}
            }
            
        # Extract pose landmarks
        pose_landmarks = holistic_results.pose_landmarks
        pose_features = self._extract_pose_features(pose_landmarks)
        
        # Update tracking history
        self.pose_history.append(pose_features)
        if len(self.pose_history) > self.max_history_len:
            self.pose_history.pop(0)
            
        # Calculate person position (for loitering detection)
        position = self._calculate_position(pose_landmarks)
        self.position_history.append(position)
        if len(self.position_history) > 300:  # Track about 10 seconds
            self.position_history.pop(0)
            
        # Analyze behaviors
        loitering_score = self._detect_loitering()
        swaying_score = self._detect_swaying()
        
        # Determine primary behavior type
        behavior_type = "none"
        if loitering_score > 0.7:
            behavior_type = "loitering"
        elif swaying_score > 0.6:
            behavior_type = "potential_intoxication"
            
        # If model exists, use it; otherwise use rule-based detection
        if self.model and len(self.pose_history) >= 10:
            # Prepare input features
            features = self._prepare_model_input()
            
            # Get prediction
            prediction = self.model.predict(features, verbose=0)
            unusual_behavior = bool(prediction[0] > 0.6)
            confidence = float(prediction[0])
            
            # Model might also classify behavior type
            if len(prediction) > 1:
                behavior_scores = prediction[1:]
                behavior_types = ["loitering", "potential_intoxication", "suspicious_interaction"]
                behavior_type = behavior_types[np.argmax(behavior_scores)]
        else:
            # Use rule-based detection
            unusual_behavior, confidence = self._rule_based_detection(loitering_score, swaying_score)
            
        return {
            "unusual_behavior": unusual_behavior,
            "confidence": confidence,
            "behavior_type": behavior_type,
            "details": {
                "loitering_score": float(loitering_score),
                "swaying_score": float(swaying_score)
            }
        }
    
    def _extract_pose_features(self, pose_landmarks) -> List[float]:
        """Extract relevant features from pose landmarks."""
        # Simplified feature extraction
        features = []
        
        # Extract key points for behavioral analysis
        key_points = [
            # Head and neck for swaying detection
            self.mp_pose.PoseLandmark.NOSE,
            self.mp_pose.PoseLandmark.LEFT_EYE,
            self.mp_pose.PoseLandmark.RIGHT_EYE,
            
            # Shoulders for posture
            self.mp_pose.PoseLandmark.LEFT_SHOULDER,
            self.mp_pose.PoseLandmark.RIGHT_SHOULDER,
            
            # Hips for stability
            self.mp_pose.PoseLandmark.LEFT_HIP,
            self.mp_pose.PoseLandmark.RIGHT_HIP,
            
            # Ankles for gait analysis
            self.mp_pose.PoseLandmark.LEFT_ANKLE,
            self.mp_pose.PoseLandmark.RIGHT_ANKLE
        ]
        
        for point in key_points:
            landmark = pose_landmarks.landmark[point]
            features.append(landmark.x)
            features.append(landmark.y)
            features.append(landmark.z)
            
        return features
    
    def _calculate_position(self, pose_landmarks) -> Tuple[float, float]:
        """Calculate person position in the frame."""
        # Use center of hips as position
        left_hip = pose_landmarks.landmark[self.mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = pose_landmarks.landmark[self.mp_pose.PoseLandmark.RIGHT_HIP]
        
        center_x = (left_hip.x + right_hip.x) / 2
        center_y = (left_hip.y + right_hip.y) / 2
        
        return (center_x, center_y)
    
    def _detect_loitering(self) -> float:
        """Detect loitering behavior from position history."""
        if len(self.position_history) < 60:  # Need at least 2 seconds
            return 0.0
            
        # Calculate the area covered by movement
        x_positions = [pos[0] for pos in self.position_history]
        y_positions = [pos[1] for pos in self.position_history]
        
        # Calculate bounding box of movement
        x_min, x_max = min(x_positions), max(x_positions)
        y_min, y_max = min(y_positions), max(y_positions)
        
        # Calculate area
        area = (x_max - x_min) * (y_max - y_min)
        
        # Small area over long time indicates loitering
        # The values here would need calibration for your specific environment
        if area < 0.01 and len(self.position_history) > 150:  # 5+ seconds in small area
            return 1.0
        elif area < 0.03 and len(self.position_history) > 240:  # 8+ seconds in slightly larger area
            return 0.8
        elif area < 0.05:
            return 0.5
        else:
            return 0.0
    
    def _detect_swaying(self) -> float:
        """Detect swaying motion (potential intoxication)."""
        if len(self.pose_history) < 15:  # Need at least 0.5 seconds
            return 0.0
            
        # Extract head positions over time
        nose_x = [pose[0] for pose in self.pose_history]  # Assuming nose x-coord is first in feature list
        shoulders_y = [(pose[10] + pose[13]) / 2 for pose in self.pose_history]  # Average of shoulders y-coord
        
        # Calculate lateral movement (swaying)
        lateral_movement = np.std(nose_x)
        
        # Calculate vertical stability
        vertical_stability = np.std(shoulders_y)
        
        # Calculate sway score
        # These thresholds would need calibration
        sway_score = lateral_movement * 5.0  # Scale up for better sensitivity
        
        # Add vertical instability
        sway_score += vertical_stability * 3.0
        
        # Cap at 1.0
        return min(1.0, sway_score)
        
    def _prepare_model_input(self):
        """Prepare input features for the ML model."""
        # Use the last 10 frames of pose data
        recent_poses = np.array(self.pose_history[-10:])
        # Reshape for model input if needed
        return recent_poses.reshape(1, 10, -1)
        
    def _rule_based_detection(self, loitering_score: float, swaying_score: float) -> Tuple[bool, float]:
        """Rule-based unusual behavior detection when no ML model is available."""
        # Combine behavior scores
        combined_score = max(loitering_score, swaying_score)
        
        # Determine if behavior is unusual
        unusual_behavior = combined_score > 0.6
        
        return unusual_behavior, combined_score
