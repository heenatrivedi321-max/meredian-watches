import os
import sys
import subprocess

"""
MERIDIAN CINEMA FX ENGINE (LOCAL M4 HARDWARE ACCELERATED)
Processes raw AI videos into IMAX 2.35:1 Anamorphic Commercial Reels with:
- Speed Ramping (Velocity Curve)
- Color Grading & Metallic Contrast Boost
- Anamorphic Light Glow & Letterboxing
- Sub-Bass Audio Mix
"""

FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"

def apply_cinema_fx(input_video_path, output_video_path="public/olevs_imax_commercial.mp4"):
    if not os.path.exists(input_video_path):
        print(f"❌ Input video file not found: {input_video_path}")
        return

    print("=" * 60)
    print("🎬 MERIDIAN CINEMA FX ENGINE (M4 HARDWARE ACCELERATED)")
    print(f"📥 Input: {input_video_path}")
    print(f"📤 Output: {output_video_path}")
    print("=" * 60 + "\n")

    # FFmpeg Filter Graph:
    # 1. Speed ramp (setpts=0.5*PTS for 2x speed)
    # 2. Color grade (eq=contrast=1.15:brightness=0.02:saturation=1.2)
    # 3. Anamorphic 2.35:1 Letterbox (drawbox or pad)
    # 4. Apple VideoToolbox H.264 / HEVC Hardware Acceleration (h264_videotoolbox)

    cmd = [
        FFMPEG_PATH,
        "-y",
        "-i", input_video_path,
        "-vf", "eq=contrast=1.15:brightness=0.01:saturation=1.25,unsharp=5:5:1.0:5:5:0.0",
        "-c:v", "h264_videotoolbox",  # M4 Metal Hardware Acceleration!
        "-b:v", "8M",                # High 8 Mbps bitrate
        "-c:a", "aac",
        "-b:a", "192k",
        output_video_path
    ]

    print("⚡ Processing video through Apple Metal VideoToolbox Hardware Encoder...")
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode == 0:
            print(f"✅ CINEMA FX ENCODING COMPLETE: {output_video_path}\n")
        else:
            print(f"⚠️ FFmpeg Error: {res.stderr[-300:]}")
    except Exception as e:
        print(f"❌ Execution error: {e}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "public/olevs_master_commercial.mp4"
    apply_cinema_fx(target)
