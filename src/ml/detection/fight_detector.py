
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import os
from typing import Dict, Any, List, Tuple

class FightDetector:
    """
    Fight detection model using pose estimation and motion analysis.
    
    This model detects physical altercations by analyzing:
    1. Pose estimation to detect aggressive postures
    2. Motion analysis to identify rapid movements
    3. Proximity analysis between individuals
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the fight detector.
        
        Args:
            model_path: Path to the TensorFlow model (optional)
        """
        # Load default model if not specified
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 
                                     "../models/fight_detection/model.h5")
        
        # Initialize MediaPipe pose estimation
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
            print(f"Loaded fight detection model from {model_path}")
        else:
            print(f"No model found at {model_path}, using rule-based detection")
            
        # Motion history for tracking
        self.motion_history = []
        self.max_history_len = 10
            
    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Detect fights in a video frame.
        
        Args:
            frame: RGB image as numpy array
            
        Returns:
            Dictionary with detection results:
            {
                "is_fight": bool,
                "confidence": float,
                "bounding_boxes": List of detected fight regions,
                "persons_involved": Number of people detected in altercation
            }
        """
        # Ensure RGB format
        if frame.shape[2] == 3 and frame[..., 0].mean() > frame[..., 2].mean():
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
        # Get pose estimation
        pose_results = self.pose.process(frame)
        
        # If no poses detected, return negative
        if not pose_results.pose_landmarks:
            return {
                "is_fight": False,
                "confidence": 0.0,
                "bounding_boxes": [],
                "persons_involved": 0
            }
            
        # Extract pose landmarks for all detected people
        landmarks = []
        if pose_results.pose_landmarks:
            landmark = pose_results.pose_landmarks
            landmarks.append(self._extract_pose_features(landmark))
            
        # Analyze motion
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
        motion_score = self._analyze_motion(frame_gray)
            
        # Determine if this is a fight
        # If model exists, use it; otherwise use rule-based detection
        if self.model:
            # Prepare input features from landmarks and motion
            features = self._prepare_model_input(landmarks, motion_score)
            
            # Get prediction
            prediction = self.model.predict(features, verbose=0)
            is_fight = bool(prediction[0] > 0.6)
            confidence = float(prediction[0])
        else:
            # Use rule-based detection
            is_fight, confidence = self._rule_based_detection(landmarks, motion_score)
            
        # Get bounding boxes
        bounding_boxes = self._get_bounding_boxes(frame, pose_results)
            
        return {
            "is_fight": is_fight,
            "confidence": confidence,
            "bounding_boxes": bounding_boxes,
            "persons_involved": len(bounding_boxes)
        }
    
    def _extract_pose_features(self, landmark) -> List[float]:
        """Extract relevant features from pose landmarks."""
        # Simplified feature extraction
        features = []
        
        # Extract key points (wrists, elbows, shoulders, hips)
        key_points = [
            self.mp_pose.PoseLandmark.LEFT_WRIST,
            self.mp_pose.PoseLandmark.RIGHT_WRIST,
            self.mp_pose.PoseLandmark.LEFT_ELBOW,
            self.mp_pose.PoseLandmark.RIGHT_ELBOW,
            self.mp_pose.PoseLandmark.LEFT_SHOULDER,
            self.mp_pose.PoseLandmark.RIGHT_SHOULDER,
            self.mp_pose.PoseLandmark.LEFT_HIP,
            self.mp_pose.PoseLandmark.RIGHT_HIP
        ]
        
        for point in key_points:
            features.append(landmark.landmark[point].x)
            features.append(landmark.landmark[point].y)
            features.append(landmark.landmark[point].z)
            
        return features
    
    def _analyze_motion(self, frame_gray: np.ndarray) -> float:
        """Analyze motion between consecutive frames."""
        # Add current frame to history
        self.motion_history.append(frame_gray)
        
        # Maintain history length
        if len(self.motion_history) > self.max_history_len:
            self.motion_history.pop(0)
            
        # If we don't have enough history, return low motion score
        if len(self.motion_history) < 2:
            return 0.0
            
        # Calculate optical flow between consecutive frames
        prev_frame = self.motion_history[-2]
        curr_frame = self.motion_history[-1]
        
        # Resize frames if they're too large (for performance)
        if prev_frame.shape[0] > 480:
            scale = 480 / prev_frame.shape[0]
            prev_frame = cv2.resize(prev_frame, None, fx=scale, fy=scale)
            curr_frame = cv2.resize(curr_frame, None, fx=scale, fy=scale)
        
        # Calculate dense optical flow
        flow = cv2.calcOpticalFlowFarneback(
            prev_frame, curr_frame, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            
        # Calculate magnitude of flow
        magnitude, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        
        # Get average motion magnitude
        mean_magnitude = np.mean(magnitude)
        
        # Normalize between 0 and 1 (assuming typical motion ranges)
        normalized_motion = min(1.0, mean_magnitude / 10.0)
        
        return normalized_motion
        
    def _prepare_model_input(self, landmarks: List[List[float]], motion_score: float):
        """Prepare input features for the ML model."""
        # Combine landmarks and motion features
        features = np.array([landmarks[0] + [motion_score]])
        return features
        
    def _rule_based_detection(self, landmarks: List[List[float]], motion_score: float) -> Tuple[bool, float]:
        """Rule-based fight detection when no ML model is available."""
        # These thresholds would ideally be determined through analysis
        motion_threshold = 0.4
        
        # High motion is a strong indicator of fighting
        if motion_score > motion_threshold:
            confidence = min(1.0, motion_score * 1.5)
            return True, confidence
        
        # Low motion, likely not a fight
        return False, motion_score
        
    def _get_bounding_boxes(self, frame: np.ndarray, pose_results) -> List[List[int]]:
        """Get bounding boxes around detected people."""
        bounding_boxes = []
        
        if pose_results.pose_landmarks:
            # Get frame dimensions
            h, w, _ = frame.shape
            
            # Get all landmark points
            landmarks = pose_results.pose_landmarks.landmark
            
            # Find min/max coordinates to create bounding box
            x_min = min(landmark.x for landmark in landmarks if landmark.visibility > 0.5)
            y_min = min(landmark.y for landmark in landmarks if landmark.visibility > 0.5)
            x_max = max(landmark.x for landmark in landmarks if landmark.visibility > 0.5)
            y_max = max(landmark.y for landmark in landmarks if landmark.visibility > 0.5)
            
            # Convert to pixel coordinates
            x_min, y_min = int(x_min * w), int(y_min * h)
            x_max, y_max = int(x_max * w), int(y_max * h)
            
            # Add some padding
            padding = 20
            x_min = max(0, x_min - padding)
            y_min = max(0, y_min - padding)
            x_max = min(w, x_max + padding)
            y_max = min(h, y_max + padding)
            
            bounding_boxes.append([x_min, y_min, x_max, y_max])
        
        return bounding_boxes
