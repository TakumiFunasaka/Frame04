#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/venv/bin/activate"
cd "$SCRIPT_DIR/comfyui"
echo "Starting ComfyUI on http://127.0.0.1:8188"
echo "Press Ctrl+C to stop"
python main.py --force-fp16
