#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Frame04 Art Pipeline Setup ==="
echo "Target: M3 Pro / 36GB / macOS"
echo ""

# 1. Python venv
echo "[1/4] Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# 2. Install ComfyUI
echo "[2/4] Installing ComfyUI..."
if [ ! -d "comfyui" ]; then
    git clone https://github.com/comfyanonymous/ComfyUI.git comfyui
fi
cd comfyui
pip install --upgrade pip
pip install -r requirements.txt
pip install pillow  # for post-processing scripts

# 3. Download models
echo "[3/4] Downloading models..."
MODELS_DIR="$SCRIPT_DIR/comfyui/models"

# SDXL base model (best quality for M3 Pro 36GB)
SDXL_CKPT="$MODELS_DIR/checkpoints/sd_xl_base_1.0.safetensors"
if [ ! -f "$SDXL_CKPT" ]; then
    echo "  Downloading SDXL base model (~6.5GB)..."
    curl -L -o "$SDXL_CKPT" \
        "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors"
else
    echo "  SDXL base model already exists, skipping."
fi

# SD 1.5 model (faster, good for pixel art)
SD15_CKPT="$MODELS_DIR/checkpoints/v1-5-pruned-emaonly.safetensors"
if [ ! -f "$SD15_CKPT" ]; then
    echo "  Downloading SD 1.5 model (~4.3GB)..."
    curl -L -o "$SD15_CKPT" \
        "https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
else
    echo "  SD 1.5 model already exists, skipping."
fi

# Pixel Art LoRA for SDXL
LORA_DIR="$MODELS_DIR/loras"
mkdir -p "$LORA_DIR"
PIXEL_LORA="$LORA_DIR/pixel-art-xl.safetensors"
if [ ! -f "$PIXEL_LORA" ]; then
    echo "  Downloading Pixel Art LoRA for SDXL..."
    curl -L -o "$PIXEL_LORA" \
        "https://huggingface.co/nerijs/pixel-art-xl/resolve/main/pixel-art-xl.safetensors"
else
    echo "  Pixel Art LoRA already exists, skipping."
fi

cd "$SCRIPT_DIR"

# 4. Setup convenience scripts
echo "[4/4] Setting up launch script..."
cat > start.sh << 'LAUNCH'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/venv/bin/activate"
cd "$SCRIPT_DIR/comfyui"
echo "Starting ComfyUI on http://127.0.0.1:8188"
echo "Press Ctrl+C to stop"
python main.py --force-fp16
LAUNCH
chmod +x start.sh

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Usage:"
echo "  1. Start ComfyUI:  cd art-pipeline && ./start.sh"
echo "  2. Open browser:   http://127.0.0.1:8188"
echo "  3. Batch generate: python scripts/batch_generate.py"
echo ""
