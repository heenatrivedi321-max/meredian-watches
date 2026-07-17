#!/usr/bin/env python3
"""
Remove Gemini watermark from videos using FFmpeg delogo filter.
Delogo blends surrounding pixels over the watermark area — pixel-level inpainting.

Usage:
  python3 remove_watermark.py                    # Process all MP4s in public/
  python3 remove_watermark.py video1.mp4 video2.mp4  # Process specific files
  python3 remove_watermark.py --preview          # Process first 2 seconds as preview
"""

import subprocess
import sys
import os
import glob

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "clean")

# Default watermark location (bottom-left, typical for Gemini)
# Adjust x,y,w,h based on your videos
DEFAULT_REGION = "delogo=x=5:y=ih-35:w=130:h=30"

WATERMARK_PRESETS = {
    "bottom-left": "delogo=x=5:y=ih-35:w=130:h=30",
    "bottom-right": "delogo=x=iw-140:y=ih-35:w=135:h=30",
    "bottom-center": "delogo=x=(iw-120)/2:y=ih-35:w=120:h=30",
    "bottom-left-large": "delogo=x=0:y=ih-45:w=180:h=40",
}


def get_video_info(path):
    cmd = [
        "ffprobe", "-v", "quiet", "-select_streams", "v:0",
        "-show_entries", "stream=width,height,duration",
        "-of", "csv=p=0", path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    parts = result.stdout.strip().split(",")
    if len(parts) >= 2:
        return {"width": int(parts[0]), "height": int(parts[1]), "duration": float(parts[2]) if len(parts) > 2 else 0}
    return None


def process_video(input_path, output_path, region, preview=False):
    info = get_video_info(input_path)
    if not info:
        print(f"  Could not read: {input_path}")
        return False

    cmd = ["ffmpeg", "-y", "-i", input_path]

    if preview:
        cmd += ["-t", "2"]

    cmd += ["-vf", region, "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-an", output_path]

    print(f"  Processing: {os.path.basename(input_path)} ({info['width']}x{info['height']})")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[-200:]}")
        return False
    
    size_in = os.path.getsize(input_path) / (1024*1024)
    size_out = os.path.getsize(output_path) / (1024*1024)
    print(f"  Done: {size_in:.1f}MB → {size_out:.1f}MB")
    return True


def main():
    args = sys.argv[1:]
    preview = "--preview" in args
    preset_name = None
    
    # Check for preset flag
    for i, a in enumerate(args):
        if a == "--preset" and i + 1 < len(args):
            preset_name = args[i + 1]
            args = args[:i] + args[i+2:]
    
    if preset_name and preset_name in WATERMARK_PRESETS:
        region = WATERMARK_PRESETS[preset_name]
    else:
        region = DEFAULT_REGION

    # Get files to process
    files = []
    for a in args:
        if a.startswith("--"):
            continue
        if os.path.isfile(a):
            files.append(a)
    
    if not files:
        files = sorted(glob.glob(os.path.join(PUBLIC_DIR, "*.mp4")))

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Using region: {region}")
    print(f"Processing {len(files)} video(s)...\n")
    
    success = 0
    for f in files:
        name = os.path.splitext(os.path.basename(f))[0]
        suffix = "_preview" if preview else "_clean"
        out = os.path.join(OUTPUT_DIR, f"{name}{suffix}.mp4")
        if process_video(f, out, region, preview):
            success += 1
        print()

    print(f"✅ {success}/{len(files)} videos processed")
    print(f"Output: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
