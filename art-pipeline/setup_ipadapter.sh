#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMFY_DIR="$SCRIPT_DIR/comfyui"

echo "=== IP-Adapter Setup for ComfyUI ==="
echo ""

# 1. Install IP-Adapter custom nodes
echo "[1/3] Installing IP-Adapter Plus custom nodes..."
CUSTOM_NODES="$COMFY_DIR/custom_nodes"
mkdir -p "$CUSTOM_NODES"

if [ ! -d "$CUSTOM_NODES/ComfyUI_IPAdapter_plus" ]; then
    git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git "$CUSTOM_NODES/ComfyUI_IPAdapter_plus"
else
    echo "  Already installed, pulling latest..."
    cd "$CUSTOM_NODES/ComfyUI_IPAdapter_plus" && git pull
fi

# 2. Download IP-Adapter model (SD1.5 version)
echo "[2/3] Downloading IP-Adapter model for SD1.5..."
IPADAPTER_DIR="$COMFY_DIR/models/ipadapter"
mkdir -p "$IPADAPTER_DIR"

# ip-adapter_sd15.safetensors (~44MB)
IPADAPTER_MODEL="$IPADAPTER_DIR/ip-adapter_sd15.safetensors"
if [ ! -f "$IPADAPTER_MODEL" ]; then
    echo "  Downloading ip-adapter_sd15.safetensors (~44MB)..."
    curl -L -o "$IPADAPTER_MODEL" \
        "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15.safetensors"
else
    echo "  Already exists, skipping."
fi

# ip-adapter-plus_sd15.safetensors (~98MB) - better quality
IPADAPTER_PLUS="$IPADAPTER_DIR/ip-adapter-plus_sd15.safetensors"
if [ ! -f "$IPADAPTER_PLUS" ]; then
    echo "  Downloading ip-adapter-plus_sd15.safetensors (~98MB)..."
    curl -L -o "$IPADAPTER_PLUS" \
        "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors"
else
    echo "  Already exists, skipping."
fi

# 3. Download CLIP Vision model (required by IP-Adapter)
echo "[3/3] Downloading CLIP Vision model..."
CLIP_DIR="$COMFY_DIR/models/clip_vision"
mkdir -p "$CLIP_DIR"

CLIP_MODEL="$CLIP_DIR/CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors"
if [ ! -f "$CLIP_MODEL" ]; then
    echo "  Downloading CLIP-ViT-H-14 (~3.9GB)..."
    curl -L -o "$CLIP_MODEL" \
        "https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors"
else
    echo "  Already exists, skipping."
fi

echo ""
echo "=== IP-Adapter Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Put Into the Breach reference images in: art-pipeline/reference/"
echo "  2. Start ComfyUI: ./start.sh"
echo "  3. Load workflow: workflows/pixel_mech_ipadapter.json"
echo ""
