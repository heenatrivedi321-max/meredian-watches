import logging
import subprocess
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)

OUTPUT_DIR = Path(__file__).resolve().parent / "processed"
OUTPUT_DIR.mkdir(exist_ok=True)


def _probe_dimensions(video_path: str) -> tuple:
    """Use ffprobe to get video width and height."""
    cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height",
        "-of", "csv=p=0",
        video_path,
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        line = result.stdout.strip()
        w, h = line.split(",")
        return int(w), int(h)
    except Exception as e:
        logger.warning("ffprobe failed for %s: %s — assuming landscape", video_path, e)
        return 1920, 1080


def prepare_reel(video_path: str, output_path: str) -> str:
    """
    Convert/crop video to 9:16 (1080x1920) for Instagram Reels.

    - Portrait source: scale to 1080 width, pad/crop height to 1920
    - Landscape source: center-crop to 9:16
    - Returns the output_path on success
    """
    src = Path(video_path)
    dst = Path(output_path)
    dst.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        raise FileNotFoundError(f"Source video not found: {src}")

    # Check if already 9:16
    w, h = _probe_dimensions(str(src))
    ratio = w / h
    target_ratio = 9 / 16  # 0.5625

    if abs(ratio - target_ratio) < 0.02:
        # Already close to 9:16 — just copy
        logger.info("Video already ~9:16, copying: %s", src.name)
        shutil.copy2(src, dst)
        return str(dst)

    # Determine if landscape or portrait
    if w > h:
        # Landscape → center crop to 9:16
        # New width = h * (9/16), crop from center
        crop_w = int(h * 9 / 16)
        x_offset = (w - crop_w) // 2
        filter_complex = (
            f"crop={crop_w}:{h}:{x_offset}:0,"
            f"scale=1080:1920:flags=lanczos,"
            f"setsar=1"
        )
        logger.info("Landscape crop: %s → 1080x1920 (was %dx%d)", src.name, w, h)
    else:
        # Portrait → scale to 1080 width, pad/crop to 1920 height
        new_w = 1080
        new_h = int(h * (1080 / w))
        filter_complex = (
            f"scale={new_w}:{new_h}:flags=lanczos,"
            f"pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,"
            f"setsar=1"
        )
        logger.info("Portrait scale: %s → 1080x1920 (was %dx%d)", src.name, w, h)

    cmd = [
        "ffmpeg", "-y",
        "-i", str(src),
        "-vf", filter_complex,
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        str(dst),
    ]

    try:
        subprocess.run(cmd, capture_output=True, check=True, timeout=120)
        logger.info("Reel prepared: %s", dst)
        return str(dst)
    except subprocess.CalledProcessError as e:
        logger.error("ffmpeg failed: %s", e.stderr.decode() if e.stderr else str(e))
        raise
    except subprocess.TimeoutExpired:
        logger.error("ffmpeg timed out for %s", src.name)
        raise


def generate_thumbnail(video_path: str, output_path: str) -> str:
    """
    Extract a frame at 50% of video duration as the thumbnail.
    Returns output_path on success.
    """
    src = Path(video_path)
    dst = Path(output_path)
    dst.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        raise FileNotFoundError(f"Source video not found: {src}")

    # Get duration
    cmd_dur = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "csv=p=0",
        str(src),
    ]
    try:
        result = subprocess.run(cmd_dur, capture_output=True, text=True, check=True)
        duration = float(result.stdout.strip())
        seek_time = duration / 2.0
    except Exception as e:
        logger.warning("Could not get duration for %s: %s — using 5s", src.name, e)
        seek_time = 5.0

    cmd = [
        "ffmpeg", "-y",
        "-ss", str(seek_time),
        "-i", str(src),
        "-vframes", "1",
        "-vf", "scale=1080:1920:flags=lanczos",
        str(dst),
    ]

    try:
        subprocess.run(cmd, capture_output=True, check=True, timeout=30)
        logger.info("Thumbnail generated: %s", dst)
        return str(dst)
    except subprocess.CalledProcessError as e:
        logger.error("Thumbnail generation failed: %s", e.stderr.decode() if e.stderr else str(e))
        raise


def get_processed_path(original_path: str) -> str:
    """Return the standard processed output path for a given original video."""
    name = Path(original_path).stem + "_9x16.mp4"
    return str(OUTPUT_DIR / name)


def get_thumbnail_path(original_path: str) -> str:
    """Return the standard thumbnail path for a given original video."""
    name = Path(original_path).stem + "_thumb.jpg"
    return str(OUTPUT_DIR / name)
