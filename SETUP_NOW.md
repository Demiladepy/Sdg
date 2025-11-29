# Get the Dashboard Running NOW

## Problem
The dashboard shows errors because it needs the backend API running.

## Solution: Use Mock Data (No Backend Required)

I'll create a version that works without the backend for demo purposes.

## Alternative: Run Backend Locally

If you have Python installed:

```bash
# Terminal 1: Install Python packages
pip3 install fastapi uvicorn

# Terminal 2: Start backend
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

Then the dashboard will work!

## For Judges: Create a Video Demo

Since you need to submit a file, here's what to do:

1. **Record a video** showing:
   - The dashboard (all 3 tabs)
   - Making a prediction
   - Exploring country data
   - The code/architecture

2. **Export as standalone HTML** (I can help with this)

3. **Create a submission package** (ZIP file)
