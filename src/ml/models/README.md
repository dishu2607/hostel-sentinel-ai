
# Model Directories

Each subdirectory contains model files and documentation for a specific detection type:

- `fight_detection/` - Models for detecting physical altercations
- `drowsiness_detection/` - Models for detecting security staff inattention/drowsiness
- `behavior_detection/` - Models for detecting unusual behaviors (including alcohol consumption)
- `access_detection/` - Models for detecting unauthorized access

## Model Downloading

The pre-trained models for each detection type should be downloaded and placed in the appropriate subdirectory. 

Example download links (placeholder - implement with your actual trained models):
- Fight Detection: 
  - Place in `fight_detection/model.h5` 
  - Dataset: RWF-2000 (Real World Fights)

- Drowsiness Detection:
  - Place in `drowsiness_detection/model.h5`
  - Dataset: UTA-RLDD (Real-Life Drowsiness Dataset)

- Behavior Detection:
  - Place in `behavior_detection/model.h5`
  - Dataset: HMDB51 (filtered for relevant behaviors)

- Access Detection:
  - Place in `access_detection/model.h5`
  - Custom dataset
