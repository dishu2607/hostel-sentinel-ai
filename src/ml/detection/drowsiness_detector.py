
import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import os
import time
from typing import Dict, Any, List, Tuple

class DrowsinessDetector:
    """
    Drowsiness detection model for security staff.
    
    This model detects signs of drowsiness by analyzing:
    1. Eye aspect ratio (EAR) to detect eye closure
    2. Head pose to detect nodding
    3. Temporal patterns of inactivity
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the drowsiness detector.
        
        Args:
            model_path: Path to the TensorFlow model (optional)
        """
        # Load default model if not specified
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 
                                     "../models/drowsiness_detection/model.h5")
        
        # Initialize MediaPipe face mesh
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Define eye landmarks indices for left and right eyes
        # MediaPipe face mesh has specific indices for eye landmarks
        self.LEFT_EYE = [33, 160, 158, 133, 153, 144]  # Example indices
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]  # Example indices
        
        # Load TensorFlow model if exists
        self.model = None
        if os.path.exists(model_path):
            self.model = tf.keras.models.load_model(model_path)
            print(f"Loaded drowsiness detection model from {model_path}")
        else:
            print(f"No model found at {model_path}, using rule-based detection")
            
        # Track temporal patterns
        self.ear_history = []
        self.head_pose_history = []
        self.last_active_time = time.time()
        self.max_history_len = 30  # About 1 second at 30fps
            
    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Detect drowsiness in a video frame.
        
        Args:
            frame: RGB image as numpy array
            
        Returns:
            Dictionary with detection results:
            {
                "is_drowsy": bool,
                "confidence": float,
                "eye_closure_ratio": float,
                "head_nodding": bool,
                "inactivity_duration": float (seconds)
            }
        """
        # Ensure RGB format
        if frame.shape[2] == 3 and frame[..., 0].mean() > frame[..., 2].mean():
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
        # Process with face mesh
        results = self.face_mesh.process(frame)
        
        # Default result if no face detected
        if not results.multi_face_landmarks:
            return {
                "is_drowsy": False,
                "confidence": 0.0,
                "eye_closure_ratio": 0.0,
                "head_nodding": False,
                "inactivity_duration": 0.0
            }
            
        # Calculate EAR (Eye Aspect Ratio)
        face_landmarks = results.multi_face_landmarks[0]
        ear = self._calculate_ear(face_landmarks)
        
        # Calculate head pose
        head_pose = self._calculate_head_pose(face_landmarks)
        
        # Update history
        self.ear_history.append(ear)
        self.head_pose_history.append(head_pose)
        
        # Maintain history length
        if len(self.ear_history) > self.max_history_len:
            self.ear_history.pop(0)
        if len(self.head_pose_history) > self.max_history_len:
            self.head_pose_history.pop(0)
            
        # Detect head nodding
        head_nodding = self._detect_head_nodding()
        
        # Calculate inactivity
        inactivity_duration = self._calculate_inactivity()
        
        # If eyes are open and head is stable, reset inactivity timer
        if ear > 0.25 and not head_nodding:
            self.last_active_time = time.time()
            
        # Determine if drowsy
        # If model exists, use it; otherwise use rule-based detection
        if self.model:
            # Prepare input features
            features = self._prepare_model_input(ear, head_pose, inactivity_duration)
            
            # Get prediction
            prediction = self.model.predict(features, verbose=0)
            is_drowsy = bool(prediction[0] > 0.6)
            confidence = float(prediction[0])
        else:
            # Use rule-based detection
            is_drowsy, confidence = self._rule_based_detection(ear, head_nodding, inactivity_duration)
            
        return {
            "is_drowsy": is_drowsy,
            "confidence": confidence,
            "eye_closure_ratio": ear,
            "head_nodding": head_nodding,
            "inactivity_duration": inactivity_duration
        }
    
    def _calculate_ear(self, face_landmarks) -> float:
        """Calculate Eye Aspect Ratio (EAR)."""
        # Extract coordinates for left and right eyes
        left_eye_pts = []
        right_eye_pts = []
        
        for idx in self.LEFT_EYE:
            left_eye_pts.append([face_landmarks.landmark[idx].x, 
                                face_landmarks.landmark[idx].y])
                                
        for idx in self.RIGHT_EYE:
            right_eye_pts.append([face_landmarks.landmark[idx].x, 
                                 face_landmarks.landmark[idx].y])
        
        # Convert to numpy array
        left_eye_pts = np.array(left_eye_pts)
        right_eye_pts = np.array(right_eye_pts)
        
        # Calculate EAR for both eyes
        left_ear = self._eye_aspect_ratio(left_eye_pts)
        right_ear = self._eye_aspect_ratio(right_eye_pts)
        
        # Average both eyes
        ear = (left_ear + right_ear) / 2.0
        
        return ear
    
    def _eye_aspect_ratio(self, eye_pts) -> float:
        """Calculate EAR from eye points."""
        # Compute vertical distances
        v1 = np.linalg.norm(eye_pts[1] - eye_pts[5])
        v2 = np.linalg.norm(eye_pts[2] - eye_pts[4])
        
        # Compute horizontal distance
        h = np.linalg.norm(eye_pts[0] - eye_pts[3])
        
        # Calculate EAR
        ear = (v1 + v2) / (2.0 * h + 1e-6)  # Avoid division by zero
        
        return ear
    
    def _calculate_head_pose(self, face_landmarks) -> List[float]:
        """Calculate head pose angles (rudimentary)."""
        # Simplified approach: use nose and eyes to estimate head tilt
        nose_tip = np.array([face_landmarks.landmark[4].x, 
                            face_landmarks.landmark[4].y])
                            
        left_eye_center = np.array([face_landmarks.landmark[33].x, 
                                   face_landmarks.landmark[33].y])
                                   
        right_eye_center = np.array([face_landmarks.landmark[263].x, 
                                    face_landmarks.landmark[263].y])
                                    
        # Calculate eye line angle
        eye_angle = np.arctan2(right_eye_center[1] - left_eye_center[1],
                              right_eye_center[0] - left_eye_center[0])
        
        # Calculate head tilt (pitch approximation)
        mid_eyes = (left_eye_center + right_eye_center) / 2
        head_tilt = np.arctan2(nose_tip[1] - mid_eyes[1],
                              nose_tip[0] - mid_eyes[0])
        
        return [float(eye_angle), float(head_tilt)]
    
    def _detect_head_nodding(self) -> bool:
        """Detect head nodding from head pose history."""
        if len(self.head_pose_history) < 10:
            return False
            
        # Extract head tilt values (pitch)
        head_tilts = [pose[1] for pose in self.head_pose_history[-10:]]
        
        # Calculate variance of head tilt
        variance = np.var(head_tilts)
        
        # High variance indicates head movement
        return variance > 0.01
    
    def _calculate_inactivity(self) -> float:
        """Calculate inactivity duration in seconds."""
        current_time = time.time()
        return current_time - self.last_active_time
        
    def _prepare_model_input(self, ear: float, head_pose: List[float], inactivity: float):
        """Prepare input features for the ML model."""
        features = np.array([[ear, head_pose[0], head_pose[1], inactivity]])
        return features
        
    def _rule_based_detection(self, ear: float, head_nodding: bool, inactivity: float) -> Tuple[bool, float]:
        """Rule-based drowsiness detection when no ML model is available."""
        # Thresholds determined through testing
        ear_threshold = 0.2  # Closed eyes threshold
        inactivity_threshold = 5.0  # 5 seconds
        
        # Calculate confidence based on multiple factors
        ear_factor = max(0, 1 - (ear / ear_threshold)) if ear < ear_threshold else 0
        inactivity_factor = min(1.0, inactivity / inactivity_threshold)
        nodding_factor = 0.7 if head_nodding else 0
        
        # Combine factors with weights
        confidence = 0.5 * ear_factor + 0.3 * inactivity_factor + 0.2 * nodding_factor
        
        # Determine drowsiness
        is_drowsy = confidence > 0.6 or ear < ear_threshold or inactivity > inactivity_threshold
        
        return is_drowsy, confidence
