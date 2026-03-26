"""
参考画像を1枚のコンポジットシートにまとめる
IP-Adapterに渡すスタイルリファレンス用
"""
from pathlib import Path
from PIL import Image

REFERENCE_DIR = Path(__file__).parent.parent / "reference"

def main():
    images = sorted(REFERENCE_DIR.glob("itb_mech_*.png"))
    if not images:
        print("No reference images found in reference/")
        return

    print(f"Found {len(images)} reference images")

    # 全画像を読み込んで最大サイズを取得
    loaded = [Image.open(p).convert("RGBA") for p in images]

    # 2x4 grid (or adjust based on count)
    cols = 4
    rows = (len(loaded) + cols - 1) // cols

    # 各セルを256x256に統一（IP-Adapterは大きめの入力が安定する）
    cell_size = 256
    sheet = Image.new("RGBA", (cell_size * cols, cell_size * rows), (26, 26, 46, 255))

    for i, img in enumerate(loaded):
        col = i % cols
        row = i // cols

        # 元画像をセルの中央にNearest Neighborで拡大配置
        # アスペクト比を維持して最大限拡大
        scale = min(cell_size / img.width, cell_size / img.height) * 0.85
        new_w = int(img.width * scale)
        new_h = int(img.height * scale)
        resized = img.resize((new_w, new_h), Image.NEAREST)

        x = col * cell_size + (cell_size - new_w) // 2
        y = row * cell_size + (cell_size - new_h) // 2
        sheet.paste(resized, (x, y), resized)

    output_path = REFERENCE_DIR / "itb_composite.png"
    sheet.save(output_path, "PNG")
    print(f"Saved composite: {output_path}")
    print(f"Size: {sheet.width}x{sheet.height}")

if __name__ == "__main__":
    main()
