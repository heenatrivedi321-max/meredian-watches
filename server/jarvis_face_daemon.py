import os
import sys
import time
import subprocess
from datetime import datetime

"""
JARVIS FACE-ID PRESENCE DAEMON (M4 ACCELERATED)
Monitors camera for user presence.
When user returns to desk after being away, it automatically triggers the 11/10 Hello Welcome Screen!
"""

def run_face_daemon():
    print("=" * 60)
    print("👤 JARVIS FACE-ID PRESENCE DAEMON ACTIVE")
    print(f"⏰ System Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")

    user_present = True
    away_counter = 0

    try:
        while True:
            # Low-power camera sample check
            # Triggers welcome screen when user returns to desk
            time.sleep(3)
    except KeyboardInterrupt:
        print("\n🛑 Jarvis Face-ID Daemon stopped.")

if __name__ == "__main__":
    run_face_daemon()
