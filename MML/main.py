# MML - main.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import redis
import requests
import json
import os

import speech_recognition as sr

REDIS_Q_KEY = 'voice-chunk-queue'
MEDIA_DIR = "media/"

def translate_to_text(audio_fn):
    """Test function needs to be replaced"""
    r = sr.Recognizer()

    speech_audio_file = sr.AudioFile(audio_fn)

    with speech_audio_file as source:
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)

    try:
        text = r.recognize_google(audio)
    except:
        print("Google didn't work")
        text = None

    return text

def process_from_redis(redisdb):
    """Pops an audio ML job off of the queue and processes it"""
    # Pop the data from the queue
    chunked_audio_json = redisdb.rpop(REDIS_Q_KEY)
    if not chunked_audio_json:
        return

    # Extract key information from the redis item
    chunked_audio_dict = json.loads(chunked_audio_json)
    local_fn = MEDIA_DIR + chunked_audio_dict['filename']
    mm404_url = "http://mm404:5000" + chunked_audio_dict['uri']

    # Download the .wav file from the server
    with requests.get(mm404_url, stream=True) as req:
        with open(local_fn, 'wb') as fil:
            for chunk in req.iter_content(chunk_size=8192):
                if chunk:
                    fil.write(chunk)

    # Do the speech recognition
    transcript = translate_to_text(local_fn)

    # Push back to redis
    if transcript:
        redisdb.lpush(chunked_audio_dict['auth'], transcript)

def main():
    redisdb = redis.StrictRedis(host='redis-processing', port=6379, db=0)
    os.makedirs(MEDIA_DIR, exist_ok=True)

    while True:
        process_from_redis(redisdb)

if __name__ == "__main__":
    main()
