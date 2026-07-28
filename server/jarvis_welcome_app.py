import os
import sys
import json
import time
import urllib.request
import urllib.parse
import subprocess
from datetime import datetime

# Load server/.env file
env_file = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_file):
    with open(env_file, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                os.environ[k] = v

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default Adam/Rachel voice

def get_daily_quote():
    quotes_file = os.path.join(os.path.dirname(__file__), 'jarvis_quotes.json')
    if os.path.exists(quotes_file):
        with open(quotes_file, 'r') as f:
            quotes = json.load(f)
            day_of_year = datetime.now().timetuple().tm_yday
            return quotes[day_of_year % len(quotes)]
    return {
        "quote": "For the late nights nobody saw and the battles fought in silence. Your time starts now.",
        "author": "Meridian Horizon"
    }

def speak_greeting(text):
    """Speak text using ElevenLabs API or high-quality macOS TTS fallback"""
    if ELEVENLABS_API_KEY:
        try:
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY
            }
            data = json.dumps({
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
            }).encode('utf-8')

            req = urllib.request.Request(url, data=data, headers=headers)
            temp_mp3 = "/tmp/jarvis_welcome_speech.mp3"
            with urllib.request.urlopen(req, timeout=5) as response:
                with open(temp_mp3, "wb") as f:
                    f.write(response.read())
            
            subprocess.Popen(["afplay", temp_mp3])
            return
        except Exception as e:
            print(f"⚠️ ElevenLabs TTS Fallback: {e}")

    # High-quality macOS native voice fallback
    greeting_voice_text = text.replace('"', '')
    subprocess.Popen(["say", "-v", "Oliver", "-r", "175", greeting_voice_text])

def launch_official_apple_hello():
    quote_obj = get_daily_quote()
    
    # Trigger audio greeting out loud
    voice_prompt = f"Hello Nirmeet. Welcome back. {quote_obj['quote']}"
    speak_greeting(voice_prompt)

    # Path to Apple Hello HTML Reel Template
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'apple_hello_welcome.html'))
    file_url = f"file://{html_path}"

    # Launch Chrome in borderless full-screen webapp mode
    cmd = [
        "open", "-na", "Google Chrome",
        "--args",
        f"--app={file_url}",
        "--start-fullscreen",
        "--user-data-dir=/tmp/apple_hello_chrome_profile"
    ]
    subprocess.Popen(cmd)

if __name__ == "__main__":
    launch_official_apple_hello()
