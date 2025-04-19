
# Hostel Security ML Models

This directory contains the ML models and scripts for detecting security incidents in hostel environments.

## Setup Instructions

1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Download the pre-trained models (links in model directories)

4. Run the detection server:
```bash
python server.py
```

## Model Architecture

The system is composed of several specialized detection models:

1. **Fight Detection Model**: Uses pose estimation and motion analysis to detect physical altercations
2. **Drowsiness Detection Model**: Monitors security staff for signs of fatigue and inattention
3. **Behavioral Anomaly Model**: Detects unusual behaviors including potential alcohol consumption
4. **Unauthorized Access Model**: Identifies tailgating and suspicious access patterns

Each model outputs confidence scores that are processed by the alert generation system.
