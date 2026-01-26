import socketio
import ctypes
import webbrowser
import pyttsx3
import pyautogui
import platform
import os
import sys

# Server Configuration
SERVER_URL = "http://localhost:3000"  # Change this to Render URL later

# Initialize Socket.io Client
sio = socketio.Client()

import threading

def speak_func(text):
    try:
        # Initialize engine inside thread to prevent conflicts
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"[!] SPEECH ERROR: {e}")

def speak(text):
    print(f"[>] SPEAKING: {text}")
    # Run speech in separate thread so it doesn't block the connection
    threading.Thread(target=speak_func, args=(text,), daemon=True).start()

@sio.event
def connect():
    print(f"[+] CONNECTED TO CONTROLLER AS: {sio.sid}")
    sio.emit('identify', 'pc')

@sio.event
def disconnect():
    print("[!] DISCONNECTED FROM CONTROLLER")

@sio.on('execute')
def execute(data):
    action = data.get('action')
    value = data.get('value', '')
    
    print(f"[*] COMMAND RECEIVED: {action} | PAYLOAD: {value}")

    try:
        if action == 'LOCK':
            if platform.system() == 'Windows':
                ctypes.windll.user32.LockWorkStation()
            else:
                print("Locking not supported on non-Windows OS")
                
        elif action == 'SPEAK':
            speak(value)

        elif action == 'OPEN':
            webbrowser.open(value)

        elif action == 'MINIMIZE':
            if platform.system() == 'Windows':
                pyautogui.hotkey('win', 'd')
                
    except Exception as e:
        print(f"[X] EXECUTION ERROR: {e}")

def main():
    print("--------------------------------")
    print("      ARKON ENFORCER v1.0       ")
    print("      WAITING FOR COMMANDS      ")
    print("--------------------------------")
    
    try:
        sio.connect(SERVER_URL)
        sio.wait()
    except Exception as e:
        print(f"[!] CONNECTION FAILED: {e}")
        # Retry logic could go here
        
if __name__ == '__main__':
    main()
