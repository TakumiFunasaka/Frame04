"""
Frame04 Mech Pixel Art Batch Generator
ComfyUI API経由でメカのドット絵を一括生成する

Usage:
    python scripts/batch_generate.py                    # 全バリアント生成
    python scripts/batch_generate.py --variant scout_01 # 特定のバリアントのみ
    python scripts/batch_generate.py --seeds 3          # バリアントごとに3シード
"""

import argparse
import json
import random
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8188"
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
WORKFLOW_PATH = PROJECT_DIR / "workflows" / "pixel_mech_sdxl.json"
PROMPTS_PATH = PROJECT_DIR / "prompts" / "mech_variants.json"
OUTPUT_DIR = PROJECT_DIR / "output"


def load_workflow() -> dict:
    with open(WORKFLOW_PATH) as f:
        return json.load(f)


def load_prompts() -> dict:
    with open(PROMPTS_PATH) as f:
        return json.load(f)


def build_prompt_text(template: str, variant: dict, defaults: dict) -> str:
    merged = {**defaults, **variant}
    return template.format(**merged)


def queue_prompt(workflow: dict) -> dict:
    data = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())
    except urllib.error.URLError as e:
        print(f"  ERROR: ComfyUI に接続できません ({e})")
        print(f"  ComfyUI が起動しているか確認してください: ./start.sh")
        sys.exit(1)


def wait_for_completion(prompt_id: str, timeout: int = 300):
    """ComfyUIのキューが空になるまで待機"""
    start = time.time()
    while time.time() - start < timeout:
        try:
            resp = urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}")
            history = json.loads(resp.read())
            if prompt_id in history:
                return history[prompt_id]
        except Exception:
            pass
        time.sleep(2)
    print(f"  WARNING: Timeout waiting for prompt {prompt_id}")
    return None


def main():
    parser = argparse.ArgumentParser(description="Batch generate mech pixel art")
    parser.add_argument("--variant", type=str, help="Generate specific variant only")
    parser.add_argument("--seeds", type=int, default=1, help="Number of seeds per variant")
    parser.add_argument("--base-seed", type=int, default=None, help="Starting seed (random if omitted)")
    args = parser.parse_args()

    workflow = load_workflow()
    prompts_config = load_prompts()
    base_template = prompts_config["base_prompt"]
    negative = prompts_config["negative_prompt"]
    defaults = prompts_config["defaults"]
    variants = prompts_config["variants"]

    if args.variant:
        variants = [v for v in variants if v["id"] == args.variant]
        if not variants:
            print(f"Variant '{args.variant}' not found.")
            sys.exit(1)

    base_seed = args.base_seed if args.base_seed is not None else random.randint(0, 2**32)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total = len(variants) * args.seeds
    current = 0

    print(f"=== Batch Generate: {len(variants)} variants x {args.seeds} seeds = {total} images ===")
    print()

    for variant in variants:
        vid = variant["id"]
        prompt_text = build_prompt_text(base_template, variant, defaults)

        for seed_idx in range(args.seeds):
            current += 1
            seed = base_seed + seed_idx
            print(f"[{current}/{total}] {vid} (seed={seed})")

            # ワークフローを更新
            wf = json.loads(json.dumps(workflow))  # deep copy
            wf["6"]["inputs"]["text"] = prompt_text
            wf["7"]["inputs"]["text"] = negative
            wf["3"]["inputs"]["seed"] = seed
            wf["9"]["inputs"]["filename_prefix"] = f"mech_{vid}_s{seed}"

            result = queue_prompt(wf)
            prompt_id = result.get("prompt_id", "unknown")
            print(f"  Queued: {prompt_id}")

            # 完了を待つ
            history = wait_for_completion(prompt_id)
            if history:
                print(f"  Done!")
            print()

    print(f"=== Complete! {total} images generated ===")
    print(f"Output: ComfyUI output directory")
    print(f"Run post-processing: python scripts/post_process.py")


if __name__ == "__main__":
    main()
