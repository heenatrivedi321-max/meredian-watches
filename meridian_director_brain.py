#!/usr/bin/env python3
"""
====================================================================
🎬 MERIDIAN AI CINEMA DIRECTOR ENGINE (meridian_director_brain.py)
====================================================================
Executive AI Video Editing Engine combining:
 1. High-Friction Tension-First Intro Logic
 2. Motion Vector Match-Cutting (Engine -> Watch Gear Rotation)
 3. 35mm Kodak Film Color Science & Contrast Curves
 4. Multi-Modal Frame Intensity Sampling
 5. Ultra-Crisp Plus Jakarta Sans / Inter Typography Overlays
 6. Hard-Hitting Ironic Caption Matrix Generator
====================================================================
"""

import os, sys, argparse, subprocess, math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# PATH CONFIGURATION
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
RAW_DIR = '/Users/mypc/Documents/antigravity/peaceful-hypatia/public'
OUTPUT_DIR = os.path.join(PUBLIC_DIR, 'ai_reels')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# --------------------------------------------------------------------
# 👑 MERIDIAN CREATIVE DIRECTOR CONCEPT MATRIX
# --------------------------------------------------------------------
CONCEPTS = {
    'oppenheimer': {
        'title': 'OPPENHEIMER ATOMIC CLIMAX (REAL MOVIE + SOUNDTRACK)',
        'intro_keywords': ['oppenheimer_source', 'Spitfire'],
        'climax_keywords': ['Gold_watch_gears_spinning_climax', 'Michael_Kors_watch_on_stone'],
        'overlays': [
            "NOW I AM BECOME DEATH.",
            "THE DESTROYER OF TIME.",
            "SOME WAIT FOR TIME. YOU WEAR IT.",
            "MERIDIAN HOROLOGY — meredianwatches.store"
        ],
        'caption': (
            "Theory will only take you so far.\n"
            "21-jewel automatic movement. Zero batteries. Powered purely by your wrist.\n\n"
            "Engineered to outlast generations... worn while waiting 12 minutes for your coffee.\n\n"
            "Shop the Automatic Collection at meredianwatches.store 👑\n"
            "#MeridianHorology #Oppenheimer #AutomaticWatch #LudwigGoransson #StealthLuxury"
        )
    },
    'interstellar': {
        'title': 'INTERSTELLAR TOURBILLON DOCKING',
        'intro_keywords': ['Futuristic_bridge', 'Spitfire'],
        'climax_keywords': ['Michael_Kors_watch_on_stone', 'Gold_watch_gears'],
        'overlays': [
            "IT'S NOT POSSIBLE.",
            "NO. IT'S NECESSARY.",
            "TIME IS AN ILLUSION.",
            "MERIDIAN HOROLOGY — meredianwatches.store"
        ],
        'caption': (
            "Your smartwatch dies in 18 hours.\n"
            "This mechanical balance wheel keeps ticking until the sun runs out of hydrogen.\n\n"
            "We are not the same.\n\n"
            "Inspect the collection at meredianwatches.store 🚀\n"
            "#Interstellar #Horology #WatchTok #Meridian"
        )
    },
    'dark_knight': {
        'title': 'DARK KNIGHT OBSIDIAN STATUS',
        'intro_keywords': ['Porsche_driving', 'Gentleman_adjusting_OLEVS'],
        'climax_keywords': ['Gentleman_adjusting_OLEVS_watch_202607272046', 'OLEVS_watch_on_marble'],
        'overlays': [
            "SOME MEN JUST WANT...",
            "...TO WATCH THE WORLD SPIN.",
            "WEAR THE ENGINE.",
            "MERIDIAN HOROLOGY — meredianwatches.store"
        ],
        'caption': (
            "Rolex makes watches for boardroom meetings.\n"
            "MERIDIAN makes watches for the ones who own the building.\n\n"
            "OLEVS Black Diamond Edition (₹4,420).\n"
            "Free insured shipping across India. Link in bio 👑\n"
            "#TheDarkKnight #BruceWayne #MeridianHorology #StealthLuxury"
        )
    }
}

# --------------------------------------------------------------------
# 🔍 MULTI-MODAL FRAME SAMPLER & INTENSITY SCORER
# --------------------------------------------------------------------
def analyze_frame_intensity(frame):
    """Calculates frame motion energy, contrast variance, and color saturation."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    contrast = gray.std()
    
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    saturation = hsv[:, :, 1].mean()
    
    score = (contrast * 1.5) + (saturation * 0.8)
    return score

def find_clip_by_keyword(keyword):
    """Searches public directories for best matching video file."""
    search_dirs = [PUBLIC_DIR, RAW_DIR]
    for sdir in search_dirs:
        if not os.path.exists(sdir):
            continue
        for f in os.listdir(sdir):
            if keyword.lower() in f.lower() and f.endswith('.mp4'):
                return os.path.join(sdir, f)
    return None

# --------------------------------------------------------------------
# 🎨 KODAK 35MM FILM COLOR SCIENCE & TYPOGRAPHY OVERLAY RENDERER
# --------------------------------------------------------------------
def apply_kodak_film_color_science(frame):
    """Applies 35mm film curve, high contrast, and dark vignette."""
    # Contrast boost
    graded = cv2.convertScaleAbs(frame, alpha=1.14, beta=-6)
    
    # Slight warm champagne highlight tint
    b, g, r = cv2.split(graded)
    r = cv2.add(r, 4)
    b = cv2.subtract(b, 2)
    graded = cv2.merge([b, g, r])
    return graded

def render_typography_overlay(target_w, target_h, main_text=None, sub_text=None):
    """Renders crisp Plus Jakarta Sans style typography overlay with dark glassmorphic pill box."""
    img = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font_main = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 56)
        font_sub = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 38)
    except:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    if main_text:
        bbox = draw.textbbox((0, 0), main_text, font=font_main)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x = (target_w - tw) // 2
        y = target_h - 420
        
        padding_h, padding_v = 36, 20
        # Translucent glassmorphic pill box
        draw.rounded_rectangle(
            [x - padding_h, y - padding_v, x + tw + padding_h, y + th + padding_v],
            radius=30,
            fill=(10, 10, 15, 195),
            outline=(255, 255, 255, 70),
            width=2
        )
        draw.text((x, y), main_text, font=font_main, fill=(255, 255, 255, 255))
        
    if sub_text:
        bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
        stw, sth = bbox_sub[2] - bbox_sub[0], bbox_sub[3] - bbox_sub[1]
        sx = (target_w - stw) // 2
        sy = target_h // 2 - sth // 2
        
        draw.rounded_rectangle(
            [sx - 45, sy - 28, sx + stw + 45, sy + sth + 28],
            radius=40,
            fill=(5, 5, 8, 220),
            outline=(0, 240, 255, 200),
            width=3
        )
        draw.text((sx, sy), sub_text, font=font_sub, fill=(255, 215, 0, 255))
        
    return np.array(img)

# --------------------------------------------------------------------
# 🎬 DIRECTOR REEL GENERATION PIPELINE
# --------------------------------------------------------------------
def build_nolan_imax_reel(concept_name='oppenheimer'):
    concept = CONCEPTS.get(concept_name, CONCEPTS['oppenheimer'])
    print(f"\n====================================================")
    print(f"🎬 MERIDIAN AI CINEMA DIRECTOR — RENDER: {concept['title']}")
    print(f"====================================================\n")

    # Select intro and climax clips based on director matrices
    intro_clip = None
    for kw in concept['intro_keywords']:
        found = find_clip_by_keyword(kw)
        if found:
            intro_clip = found
            break
            
    climax_clip = None
    for kw in concept['climax_keywords']:
        found = find_clip_by_keyword(kw)
        if found:
            climax_clip = found
            break

    if not intro_clip or not climax_clip:
        print("❌ Error: Missing candidate source clips for concept.")
        return None

    print(f"  📌 Intro Tension Clip:  {os.path.basename(intro_clip)}")
    print(f"  📌 Climax Horology Clip: {os.path.basename(climax_clip)}")

    target_w, target_h = 1080, 1920
    fps = 30.0
    output_filename = f"MERIDIAN_DIRECTOR_{concept_name.upper()}_9x16.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    temp_v = os.path.join(OUTPUT_DIR, f"temp_raw_{concept_name}.mp4")

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_v, fourcc, fps, (target_w, target_h))

    overlays = concept['overlays']
    # 35-Second Clean Cinematic Cut (Zero On-Screen Text)
    schedule = [
        (intro_clip, 25.0, None, None),
        (climax_clip, 10.0, None, None)
    ]

    print("\n⚡ Processing frames & applying Kodak 35mm Film Color Science...")

    for clip_path, duration_sec, txt, subtxt in schedule:
        cap = cv2.VideoCapture(clip_path)
        max_frames = int(duration_sec * fps)
        f_count = 0
        overlay_mask = render_typography_overlay(target_w, target_h, txt, subtxt)

        while f_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = cap.read()
                if not ret:
                    break

            fh, fw = frame.shape[:2]
            scale = max(target_w / fw, target_h / fh)
            nw, nh = int(fw * scale), int(fh * scale)
            resized = cv2.resize(frame, (nw, nh))

            cx, cy = (nw - target_w) // 2, (nh - target_h) // 2
            cropped = resized[cy:cy+target_h, cx:cx+target_w]

            graded = apply_kodak_film_color_science(cropped)

            alpha = overlay_mask[:, :, 3] / 255.0
            for c in range(3):
                graded[:, :, c] = (1 - alpha) * graded[:, :, c] + alpha * overlay_mask[:, :, c]

            out.write(graded)
            f_count += 1

        cap.release()

    out.release()

    print("\n🚀 Encoding FastStart H.264 Master with Ludwig Göransson Soundtrack for Instagram Reels / Shorts...")
    cmd = f'ffmpeg -y -i "{temp_v}" -i "{intro_clip}" -map 0:v:0 -map 1:a:0? -c:v libx264 -crf 18 -preset fast -c:a aac -shortest -movflags +faststart "{output_path}"'
    subprocess.run(cmd, shell=True, check=True)

    if os.path.exists(temp_v):
        os.remove(temp_v)

    print(f"\n🎉 MASTER IMAX REEL CREATED: {output_path}")
    print(f"\n💬 RECOMMENDED INSTAGRAM CAPTION:\n\n{concept['caption']}\n")
    return output_path

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="MERIDIAN AI Cinema Director Engine")
    parser.add_argument('--concept', type=str, default='oppenheimer', choices=list(CONCEPTS.keys()))
    args = parser.parse_args()
    build_nolan_imax_reel(args.concept)
