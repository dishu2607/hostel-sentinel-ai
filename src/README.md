
# Hostel Sentinel AI - Security Monitoring System

## Project Overview

Hostel Sentinel AI is an intelligent security monitoring system that enhances traditional CCTV infrastructure with AI-powered video analytics. The system provides real-time detection of security incidents including altercations, unauthorized access, behavioral anomalies, and staff vigilance issues.

## Dashboard Features

1. **Real-Time Monitoring Dashboard**
   - Incident overview and statistics
   - Camera feed display with AI analysis
   - Alert management and response system

2. **Camera Views**
   - Live feeds from all cameras
   - Organized by zones (entrances, hallways, common areas, restricted zones)
   - Alert indicators for cameras with detected issues

3. **Alert Management**
   - Comprehensive view of all security incidents
   - Filtering by type, severity, and status
   - Detailed information for investigation and response

4. **Analytics & Reporting**
   - Incident trends and patterns
   - Performance metrics and statistics
   - Location-based analysis

5. **System Configuration**
   - AI detection settings
   - Notification preferences
   - Camera and video settings
   - User and access management

## Connecting to the Backend

The frontend dashboard is designed to connect to a backend API that interfaces with AI models for video analysis. To connect your AI models:

1. Implement the API endpoints defined in `src/services/api.ts`
2. Replace the mock implementations with actual API calls to your ML backend
3. Ensure your backend provides the data in the format expected by the frontend

## AI Model Integration

The system is designed to work with the following AI models:

1. **Altercation Detection Model**
   - Detects physical fights and aggressive behavior
   - Uses motion analysis, posture detection, and pattern recognition

2. **Unauthorized Access Model**
   - Identifies tailgating, forced entry, and suspicious access patterns
   - Tracks individuals and their entry/exit behaviors

3. **Behavioral Anomaly Model**
   - Detects unusual actions like loitering, door checking, and suspicious interactions
   - Uses pattern recognition to identify deviations from normal behaviors

4. **Staff Vigilance Model**
   - Monitors security staff for attention levels and proper coverage
   - Detects inactivity, absence from post, or sleeping

## Backend Development Guide

When developing your backend with AI models, follow these steps:

1. Use the model architecture described in `src/services/mockBackend.ts` as a reference
2. Implement each AI model separately (altercation, unauthorized access, behavioral, staff vigilance)
3. Create API endpoints that match the interface expected by the frontend
4. Ensure your real-time processing pipeline can handle video streams from multiple cameras
5. Implement a notification system for real-time alerts

## Technologies

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

### Suggested Backend
- Python with FastAPI or Flask
- TensorFlow or PyTorch for ML models
- OpenCV for video processing
- Roboflow for model training and dataset management

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Develop your backend following the API specifications
4. Connect the frontend to your backend by updating the API service

## Next Steps

1. Implement the ML models for video analysis
2. Develop the backend API following the provided structure
3. Connect the frontend dashboard to your backend API
4. Train and fine-tune your models with your specific hostel environment data
